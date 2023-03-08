/* globals Worker */

import * as InputData from '@vegaprotocol/protos/dist/vega/commands/v1/InputData/encode.js'
import * as Transaction from '@vegaprotocol/protos/dist/vega/commands/v1/Transaction/encode.js'
import { TX_VERSION_V3 } from '@vegaprotocol/protos/dist/vega/commands/v1/TxVersion.js'
import { VegaWallet, HARDENED } from '@vegaprotocol/crypto'
import NodeRPC from './backend/node-rpc.js'
import Ajv from 'ajv'
import ajvErrors from 'ajv-errors'
import JSONRPCServer from './lib/json-rpc-server.js'
import clientSendTransaction from './schemas/client/send-transaction.js'
import JSONRPCClient from './lib/json-rpc-client.js'

const runtime = (globalThis.browser?.runtime ?? globalThis.chrome?.runtime)
const action = (globalThis.browser?.browserAction ?? globalThis.chrome?.action)

const rpc = new NodeRPC(new URL('https://n01.stagnet3.vega.xyz'))
const _powWorker = new Worker(runtime.getURL('/pow-worker.js'))
const powWorker = new JSONRPCClient({
  send (req) {
    _powWorker.postMessage(req)
  }
})
_powWorker.onmessage = (ev) => {
  powWorker.onmessage(ev.data)
}

class ClientChannels {
  constructor (onmessage = async (_1, _2) => {}) {
    // Map<Port, Map<id, message>>
    this.ports = new Map()

    this.onmessage = onmessage
  }

  totalPending () {
    return Array.from(this.ports.values(), v => v.size)
      .reduce((sum, size) => sum + size, 0)
  }

  onchange () {
    const pending = this.totalPending()
    action.setBadgeText({
      text: pending === 0 ? '' : pending.toString()
    })
  }

  listen (port) {
    const self = this

    const origin = new URL(port.sender.url).origin

    this.ports.set(port, new Set())
    port.onMessage.addListener(_onmessage)
    port.onDisconnect.addListener(_ondisconnect)

    function _onmessage (message) {
      self.ports.get(port)?.add(message)

      self.onchange()
      self.onmessage(message, origin).finally(() => {
        self.ports.get(port)?.delete(message)
        self.onchange()
      }).then(res => {
        if (self.ports.has(port) === false) return console.error('No port')
        port.postMessage(res)
      }).catch(ex => {
        console.log('ex', JSON.stringify(ex))
      })
    }

    function _ondisconnect () {
      port.onMessage.removeEventListener(_onmessage)
      port.onDisconnect.removeEventListener(_ondisconnect)

      self.ports.delete(port)
      self.onchange()
    }
  }
}

const clientServer = new JSONRPCServer({
  methods: {
    async 'client.connect_wallet' (params, context) {
      return null
    },
    async 'client.disconnect_wallet' (params, context) {
      return null
    },
    async 'client.send_transaction' (params, context) {
      return sendTransaction(params)
    },
    async 'client.sign_transaction' (params, context) {
      throw new JSONRPCServer.Error('Not Implemented', -32601)
    },
    async 'client.get_chain_id' (params, context) {
      const latestBlock = await rpc.blockchainHeight()
      return { chainID: latestBlock.chainId }
    },

    'client.list_keys' (params, context) {
      return { keys: [] }
    }
  },
  onerror (err) {
    console.error(err)
  }
})

const clients = new ClientChannels(async (message) => {
  const res = await clientServer.onrequest(message, { origin: '' })

  return res
})

runtime.onConnect.addListener(port => {
  if (port.name === 'popup') return popup(port)
  if (port.name === 'content-script') return clients.listen(port)
})

function popup (port) {
  port.onMessage.addListener(async message => {
    console.log(message)
  })

  port.onDisconnect.addListener((...args) => {
    console.log(args)
  })
}

const ajv = new Ajv({ allErrors: true })
ajvErrors(ajv)
const validateSendTransaction = ajv.compile(clientSendTransaction)

async function sendTransaction (params) {
  if (!validateSendTransaction(params)) throw new JSONRPCServer.Error(validateSendTransaction.errors[0].message, 1, validateSendTransaction.errors.map(e => e.message))

  const latestBlock = await rpc.blockchainHeight()
  const pow = await powWorker.request('solve', {
    difficulty: latestBlock.spamPowDifficulty + 20,
    blockHash: latestBlock.hash,
    tid: latestBlock.hash
  })

  const wallet = await VegaWallet.fromMnemonic(MNEMONIC)
  const keys = await wallet.keyPair(HARDENED + 1)

  const nonce = BigInt(Math.random() * Number.MAX_SAFE_INTEGER >>> 0)
  const blockHeight = BigInt(latestBlock.height)
  const chainId = latestBlock.chainId

  const inputData = InputData.encode({
    blockHeight,
    nonce,
    command: params.transaction
  })

  const tx = Transaction.encode({
    inputData,
    signature: {
      value: Buffer.from(await keys.sign(inputData, chainId)).toString('hex'),
      algo: keys.algorithm.name,
      version: keys.algorithm.version
    },
    from: {
      pubKey: keys.publicKey.toString()
    },
    version: TX_VERSION_V3,
    pow
  })

  try {
    return await rpc.submitRawTransaction(Buffer.from(tx).toString('base64'), params.sendingMode)
  } catch (ex) {
    throw new JSONRPCServer.Error(ex.message, -1, ex)
  }
}
