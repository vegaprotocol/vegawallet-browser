import JSONRPCServer from '../../lib/json-rpc-server.js'
import * as txHelpers from './tx-helpers.js'
import * as clientValidation from '../validation/client/index.js'
import NodeRPC from './node-rpc.js'

const Errors = {
  NOT_CONNECTED: ['Not connected', -1, 'You must connect to the wallet before further interaction'],
  CONNECTION_DENIED: ['Connection denied', -2, 'The user denied the connection request'],

  UNKNOWN_PUBLIC_KEY: ['Unknown public key', -3, 'The public key is not known to the wallet'],
  TRANSACTION_DENIED: ['Transaction denied', -4, 'The user denied the transaction request'],

  TRANSACTION_FAILED: ['Transaction failed', -5 /* This is filled in by the error thrown */],

}

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
        if (context.isConnected === true) return null
        if ((await connections.has(context.origin)) === false) {
          const approved = await interactor.reviewConnection({
            origin: context.origin,
            receivedAt
          })

          if (approved === false) throw new JSONRPCServer.Error(...Errors.CONNECTION_DENIED)

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
        if (context.isConnected !== true) throw new JSONRPCServer.Error(...Errors.NOT_CONNECTED)
        if ((await connections.isAllowed(context.origin, params.publicKey)) === false) {
          throw new JSONRPCServer.Error(...Errors.UNKNOWN_PUBLIC_KEY)
        }

        const keyInfo = await wallets.getKeyInfo({
          publicKey: params.publicKey
        })

        if (keyInfo == null) throw new JSONRPCServer.Error(...Errors.UNKNOWN_PUBLIC_KEY)

        const approved = await interactor.reviewTransaction({
          transaction: params.transaction,
          publicKey: params.publicKey,
          name: keyInfo.name,
          wallet: keyInfo.wallet,
          sendingMode: params.sendingMode,
          origin: context.origin,
          receivedAt
        })

        if (approved === false) throw new JSONRPCServer.Error(...Errors.TRANSACTION_DENIED)

        const key = await wallets.getKeypair({ publicKey: params.publicKey })

        const selectedNetwork = await settings.get('selectedNetwork')
        const network = await networks.get(selectedNetwork)
        const rpc = await network.rpc()

        try {

          const res = await txHelpers.sendTransaction({
            keys: key.keyPair,
            rpc,
            sendingMode: params.sendingMode,
            transaction: params.transaction
          })

          res.receivedAt = receivedAt

          return res
        } catch (e) {
          if (NodeRPC.isTxError(e)) {
            throw new JSONRPCServer.Error(...Errors.TRANSACTION_FAILED, {
              message: e.message,
              code: e.code
            })
          }

          throw e
        }
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
        if (context.isConnected !== true) throw new JSONRPCServer.Error(...Errors.NOT_CONNECTED)

        const keys = await connections.listAllowedKeys(context.origin)

        return { keys }
      }
    }
  })
}
