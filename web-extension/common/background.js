/* global chrome, browser */

import assert from 'nanoassert'

import * as InputData from '@vegaprotocol/protos/dist/vega/commands/v1/InputData/encode.js'
import * as Transaction from '@vegaprotocol/protos/dist/vega/commands/v1/Transaction/encode.js'
import { TX_VERSION_V3 } from '@vegaprotocol/protos/dist/vega/commands/v1/TxVersion.js'
import { VegaWallet, HARDENED, PoW } from "@vegaprotocol/crypto"

const runtime = (globalThis.browser?.runtime ?? globalThis.chrome?.runtime)
const action = (globalThis.browser?.browserAction ?? globalThis.chrome?.action)

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

const clients = new ClientChannels(async (message) => {
  try {
    switch (message.method) {
      case 'client.send_transaction':
        return {
          jsonrpc: '2.0',
          id: message.id,
          result: await sendTransaction(message)
        }
      case 'client.get_chain_id'
    }
  } catch (ex) {
    return {
      jsonrpc: '2.0',
      id: message.id,
      result: ex.message
    }
  }


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

class PopupChannel {
  constructor () {
    this.ports = new WeakMap()
  }

  onconnect (port) {
    assert(port.name === 'popup')

  }

  onmessage () {}

  ondisconnect (port) {
    this.ports
  }
}

async function sendTransaction (message) {
  const MNEMONIC = '...'
  const NODE_URL = new URL('https://n01.stagnet1.vega.xyz')

  const latestBlock = await (await fetch(new URL('/blockchain/height', NODE_URL))).json()

  const wallet = await VegaWallet.fromMnemonic(MNEMONIC)
  const keys = await wallet.keyPair(HARDENED + 1)

  const nonce = BigInt(Math.random() * Number.MAX_SAFE_INTEGER >>> 0)
  const blockHeight = BigInt(latestBlock.height)
  const chainId = latestBlock.chainId

  const inputData = InputData.encode({
    blockHeight,
    nonce,
    command: message.params.transaction
  })

  const tx = Transaction.encode({
    inputData,
    signature: {
      value: Buffer.from(await keys.sign(inputData, chainId)).toString('hex'),
      algo: wallet.algorithm.name,
      version: wallet.algorithm.version
    },
    from: {
      pubKey: keys.pk.toString()
    },
    version: TX_VERSION_V3,
    pow: await PoW.solve(
      latestBlock.spamPowDifficulty,
      latestBlock.hash,
      latestBlock.hash
    )
  })

  const res = await (await fetch(new URL('/transaction/raw', NODE_URL), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tx: Buffer.from(tx).toString('base64'),
      type: message.params.sendingMode
    })
  })).json()

  if (res.code != 0) {
    throw new Error(res)
  }

  return res
}
