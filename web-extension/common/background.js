import { NetworkCollection } from './backend/network.js'
import { WalletCollection } from './backend/wallets.js'
import { PortServer } from './lib/port-server.js'
import JSONRPCServer from './lib/json-rpc-server.js'
import * as clientValidation from './validation/client/index.js'
import * as adminValidation from './validation/admin/index.js'
import * as backend from './backend/index.js'
import StorageLocalMap from './lib/storage.js'

const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime
const action = globalThis.browser?.browserAction ?? globalThis.chrome?.action

const wallets = new WalletCollection(new StorageLocalMap('wallets'))
const networks = new NetworkCollection(new StorageLocalMap('networks'))

const selectedNetwork = 'fairground'
const selectedWallet = 'Wallet 1'

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

        const network = await networks.get(selectedNetwork)
        const rpc = network.rpc()

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

        const network = await networks.get(selectedNetwork)
        const rpc = network.rpc()

        const chainID = await backend.getChainId({ rpc })
        return { chainID }
      },

      async 'client.list_keys'(params, context) {
        doValidate(clientValidation.listKeys, params)

        const ws = await wallets.list()
        const keys = (
          await Promise.all(ws.map((w) => wallets.listKeys({ wallet: w })))
        ).flat()

        return { keys }
      }
    },
    onerror(err) {
      console.error(err)
    }
  })
})

const popupPorts = new PortServer({
  server: new JSONRPCServer({
    methods: {
      async 'admin.list_networks'() {
        return { networks: await networks.list() }
      },
      async 'admin.list_wallets'(params) {
        doValidate(adminValidation.listWallets, params)
        return { wallets: await wallets.list() }
      },
      async 'admin.list_keys'(params) {
        doValidate(adminValidation.listKeys, params)
        return { keys: await wallets.listKeys({ wallet: params.wallet }) }
      }
    }
  })
})

runtime.onConnect.addListener(async (port) => {
  if (port.name === 'popup') return popupPorts.listen(port)
  if (port.name === 'content-script') return clientPorts.listen(port)
})

runtime.onInstalled.addListener(async (details) => {
  await StorageLocalMap.permanentClearAll()

  await Promise.allSettled([
    // networks.set('stagnet1', {
    //   name: 'Stagnet1',
    //   rest: ['https://api.stagnet1.vega.xyz', 'https://api.n05.stagnet1.vega.xyz', 'https://api.n06.stagnet1.vega.xyz'],
    //   explorer: 'https://stagnet1.explorer.vega.xyz/'
    // }),
    wallets.create({ name: selectedWallet }),
    networks.set('fairground', {
      name: 'Fairground',
      rest: [
        'https://api.testnet.vega.xyz',
        'https://api.n06.testnet.vega.xyz',
        'https://api.n07.testnet.vega.xyz',
        'https://api.n08.testnet.vega.xyz',
        'https://api.n09.testnet.vega.xyz',
        'https://api.n10.testnet.vega.xyz',
        'https://api.n11.testnet.vega.xyz',
        'https://api.n12.testnet.vega.xyz'
      ],
      explorer: 'https://explorer.fairground.wtf/'
    })
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
