import JSONRPCServer from '../../json-rpc/json-rpc-server.js'
import * as txHelpers from './tx-helpers.js'
import * as clientValidation from '../validation/client/index.js'

function doValidate(validator, params) {
  if (!validator(params))
    throw new JSONRPCServer.Error(
      validator.errors[0].message,
      1,
      validator.errors.map((e) => e.message)
    )
}
export default function init({ onerror, settings, wallets, networks, connections, interactor }) {
  return new JSONRPCServer({
    onerror,
    methods: {
      async 'client.connect_wallet'(params, context) {
        const receivedAt = new Date().toISOString()
        doValidate(clientValidation.connectWallet, params)
        if ((await connections.has(context.origin)) === false) {
          const approved = await interactor.reviewConnection({
            origin: context.origin,
            receivedAt
          })

          if (approved === false) throw new JSONRPCServer.Error('Connection denied', -32000)

          await connections.set(context.origin, {
            publicKeys: [],
            // TODO: Allow all wallets and keys for now
            wallets: await wallets.list()
          })
        }
        context.isConnected = true

        return null
      },
      async 'client.disconnect_wallet'(params, context) {
        doValidate(clientValidation.disconnectWallet, params)
        context.isConnected = false

        return null
      },
      async 'client.send_transaction'(params, context) {
        const receivedAt = new Date().toISOString()
        doValidate(clientValidation.sendTransaction, params)
        if (context.isConnected === false) throw new JSONRPCServer.Error('Not connected', -32000)
        if ((await connections.isAllowed(context.origin, params.publicKey)) === false) {
          throw new JSONRPCServer.Error('Unknown public key', -32000)
        }

        const key = await wallets.getKeyByPublicKey({
          publicKey: params.publicKey
        })

        if (key == null) throw new JSONRPCServer.Error('Unknown public key')

        const approved = await interactor.reviewTransaction({
          transaction: params.transaction,
          publicKey: params.publicKey,
          name: key.name,
          wallet: key.wallet,
          sendingMode: params.sendingMode,
          origin: context.origin,
          receivedAt
        })

        if (approved === false) throw new JSONRPCServer.Error('Transaction denied', -32000)

        const selectedNetwork = await settings.get('selectedNetwork')
        const network = await networks.get(selectedNetwork)
        const rpc = await network.rpc()

        return txHelpers.sendTransaction({
          keys: key.keyPair,
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

        const chainID = await txHelpers.getChainId({ rpc })
        return { chainID }
      },

      async 'client.list_keys'(params, context) {
        doValidate(clientValidation.listKeys, params)
        if (context.isConnected === false) throw new JSONRPCServer.Error('Not connected', -32000)

        const keys = await connections.listAllowedKeys(context.origin)

        return { keys }
      }
    }
  })
}
