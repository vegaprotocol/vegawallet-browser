import { Networks } from './services/networks'

export class WalletService {
  private networks: Networks

  constructor({ networks }: { networks: Networks }) {
    this.networks = networks
  }

  /**
   * Handler for all methods in the `client.*` namespace
   *
   * @async
   * @param method Any method from the Vega OpenRPC `client.*`
   * @param params
   * @param origin The origin of the callee. Must include the protocol, FQDN and optional port number
   * @returns
   */
  async handleClient(method: string, params: any, origin: string) {
    // TODO Handle any calls in the client namespace, including permission check
    switch (method) {
      case 'client.connect_wallet':
        return notImplemented()
      case 'client.disconnect_wallet':
        return notImplemented()
      case 'client.list_keys':
        return notImplemented()
      case 'client.sign_transaction':
        return notImplemented()
      case 'client.send_transaction':
        return notImplemented()
      case 'client.get_chain_id':
        return notImplemented()

      default:
        return notImplemented()
    }
  }

  /**
   * Handler for all methods in the `admin.*` namespace.
   *
   * @async
   * @param method Any method from teh Vega OpenRPC methods in the `admin.*` namespace
   * @param params Corresponding documented parameters
   * @returns
   */
  async handleAdmin(method: string, params: any) {
    // TODO: Ultimately this function should use the same types as the wallet-ui, however
    //       currently we cannot satisfy the types without implementing the methods
    switch (method) {
      // Wallets
      case 'admin.list_wallets':
        return notImplemented()
      case 'admin.create_wallet':
        return notImplemented()
      case 'admin.import_wallet':
        return notImplemented()
      case 'admin.describe_wallet':
        return notImplemented()
      case 'admin.rename_wallet':
        return notImplemented()
      case 'admin.remove_wallet':
        return notImplemented()

      // Network
      case 'admin.list_networks':
        return this.networks.list()
      case 'admin.import_network':
        return this.networks.import(params)
      case 'admin.describe_network':
        return this.networks.describe(params)
      case 'admin.update_network':
        return this.networks.update(params)
      case 'admin.remove_network':
        return this.networks.remove(params)

      // Keys
      case 'admin.generate_key':
        return notImplemented()
      case 'admin.describe_key':
        return notImplemented()
      case 'admin.list_keys':
        return notImplemented()
      case 'admin.annotate_key':
        return notImplemented()
      case 'admin.isolate_key':
        return notImplemented()
      case 'admin.rotate_key':
        return notImplemented()
      case 'admin.taint_key':
        return notImplemented()
      case 'admin.untain_key':
        return notImplemented()

      // Permissions
      case 'admin.describe_permissions':
        return notImplemented()
      case 'admin.list_permissions':
        return notImplemented()
      case 'admin.update_permissions':
        return notImplemented()
      case 'admin.revoke_permissions':
        return notImplemented()
      case 'admin.purge_permissions':
        return notImplemented()

      // Transactions
      case 'admin.sign_transaction':
        return notImplemented()
      case 'admin.sign_message':
        return notImplemented()
      case 'admin.verify_message':
        return notImplemented()
      case 'admin.send_transaction':
        return notImplemented()

      // Fallback
      default:
        return notImplemented()
    }
  }
}

function notImplemented() {
  throw new Error('Method not implemented')
}
