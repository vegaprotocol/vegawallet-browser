import { NetworkCollection } from './backend/network.js'
import { WalletCollection } from './backend/wallets.js'
import { PortServer } from './lib/port-server.js'
import JSONRPCServer from './lib/json-rpc-server.js'
import * as clientValidation from './validation/client/index.js'
import * as backend from './backend/index.js'
import StorageLocalMap from './lib/storage.js'
import ConcurrentStorage from './lib/concurrent-storage.js'
import init from './backend/admin-ns.js'

const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime
const action = globalThis.browser?.browserAction ?? globalThis.chrome?.action

const settings = new ConcurrentStorage(new StorageLocalMap('settings'))
const wallets = new WalletCollection({
  walletsStore: new ConcurrentStorage(new StorageLocalMap('wallets')),
  publicKeyIndexStore: new ConcurrentStorage(new StorageLocalMap('publicKeyIndex'))
})
const networks = new NetworkCollection(new ConcurrentStorage(new StorageLocalMap('networks')))

const clientPorts = new PortServer({
  onbeforerequest: setPending,
  onafterrequest: setPending,
  onerror(err) {
    console.error(err)
  },
  server: new JSONRPCServer({
    methods: {
      async 'client.connect_wallet'(params, context) {
        doValidate(clientValidation.connectWallet, params)
        return null
      },
      async 'client.disconnect_wallet'(params, context) {
        doValidate(clientValidation.disconnectWallet, params)
        return null
      },
      async 'client.send_transaction'(params, context) {
        doValidate(clientValidation.sendTransaction, params)

        const selectedNetwork = await settings.get('selectedNetwork')
        const network = await networks.get(selectedNetwork)
        const rpc = await network.rpc()

        const keys = await wallets.getKeyByPublicKey({
          publicKey: params.publicKey
        })
        if (keys == null) throw new Error('Unknown public key')

        return backend.sendTransaction({
          keys,
          rpc,
          sendingMode: params.sendingMode,
          transaction: params.transaction
        })
      },
      async 'client.sign_transaction'(params, context) {
        throw new JSONRPCServer.Error('Not Implemented', -32601)
      },
      async 'client.get_chain_id'(params, context) {
        doValidate(clientValidation.getChainId, params)

        const selectedNetwork = await settings.get('selectedNetwork')
        const network = await networks.get(selectedNetwork)
        const rpc = await network.rpc()

        const chainID = await backend.getChainId({ rpc })
        return { chainID }
      },

      async 'client.list_keys'(params, context) {
        doValidate(clientValidation.listKeys, params)

        const ws = await wallets.list()
        const keys = (await Promise.all(ws.map((w) => wallets.listKeys({ wallet: w })))).flat()

        return { keys }
      }
    },
    onerror(err) {
      console.error(err)
    }
  })
})

const server = init({
  settings,
  wallets,
  networks,
  onerror: (...args) => console.error(args)
})

const popupPorts = new PortServer({
  server
})

runtime.onConnect.addListener(async (port) => {
  if (port.name === 'popup') return popupPorts.listen(port)
  if (port.name === 'content-script') return clientPorts.listen(port)
})

runtime.onInstalled.addListener(async (details) => {
  await StorageLocalMap.permanentClearAll()

  await Promise.allSettled([
    networks.set('fairground', {
      name: 'Fairground',
      rest: ['https://api.n06.testnet.vega.xyz', 'https://api.n07.testnet.vega.xyz'],
      explorer: 'https://explorer.fairground.wtf/'
    }),
    settings.set('selectedNetwork', 'fairground')
  ])
})

function setPending() {
  const pending = clientPorts.totalPending()
  action.setBadgeText({
    text: pending === 0 ? '' : pending.toString()
  })
}

function doValidate(validator, params) {
  if (!validator(params))
    throw new JSONRPCServer.Error(
      validator.errors[0].message,
      1,
      validator.errors.map((e) => e.message)
    )
}
