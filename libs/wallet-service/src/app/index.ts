import { WalletStore } from '../storage'
import { Networks } from '../services/networks'
import { Keys } from '../services/keys'
import { Wallets } from '../services/wallets'
import { Client } from '../services/client'
import { Implementation } from '../events'

export class WalletService {
  private store: WalletStore
  private networks: Networks
  private wallets: Wallets
  private keys: Keys
  private client: Client

  constructor({
    store,
    implementation,
  }: {
    store: WalletStore
    implementation: Implementation
  }) {
    this.store = store
    this.networks = new Networks(store.networks)
    this.wallets = new Wallets(store.wallets)
    this.keys = new Keys(store.keys)
    this.client = new Client(origin, this.store, implementation)
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleClient(method: string, params: any, origin: string) {
    // TODO Handle any calls in the client namespace, including permission check
    switch (method) {
      case 'client.connect_wallet':
        return this.client.connect()
      case 'client.disconnect_wallet':
        return this.client.disconnect()
      case 'client.list_keys':
        return this.client.listKeys()
      case 'client.sign_transaction':
        return this.client.signTransaction(params)
      case 'client.send_transaction':
        return this.client.sendTransaction(params)
      case 'client.get_chain_id':
        return this.client.getChainId()

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
  // TODO: Ultimately this function should use the same types as the wallet-ui, however
  //       currently we cannot satisfy the types without implementing the methods
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleAdmin(method: string, params: any) {
    switch (method) {
      // Wallets
      case 'admin.list_wallets':
        return this.wallets.list(params)
      case 'admin.create_wallet':
        return this.wallets.create(params)
      case 'admin.import_wallet':
        return this.wallets.import(params)
      case 'admin.describe_wallet':
        return this.wallets.describe(params)
      case 'admin.rename_wallet':
        return this.wallets.rename(params)
      case 'admin.remove_wallet':
        return this.wallets.remove(params)

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
        return this.keys.generate(params)
      case 'admin.describe_key':
        return this.keys.describe(params)
      case 'admin.list_keys':
        return this.keys.list(params)
      case 'admin.annotate_key':
        return this.keys.annotate(params)
      case 'admin.isolate_key':
        return notImplemented()
      case 'admin.rotate_key':
        return notImplemented()
      case 'admin.taint_key':
        return this.keys.taint(params)
      case 'admin.untain_key':
        return this.keys.untaint(params)

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
