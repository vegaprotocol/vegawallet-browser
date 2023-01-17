import { WalletStore } from '../storage'
import { Networks } from '../services/networks'
import { Client } from '../services/client'
import { EventBus } from '../events'
import { Identifier as AdminIdentifier } from '@vegaprotocol/wallet-admin'
import { Identifier as ClientIdentifier } from '@vegaprotocol/wallet-client'

export class WalletService {
  private client: Client
  private networks: Networks

  constructor({ store, eventBus }: { store: WalletStore; eventBus: EventBus }) {
    this.client = new Client(store, eventBus)
    this.networks = new Networks(store.networks)
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
      case ClientIdentifier.ConnectWallet:
        return this.client.connect(origin)
      case ClientIdentifier.DisconnectWallet:
        return this.client.disconnect(params, origin)
      case ClientIdentifier.ListKeys:
        return this.client.listKeys(params, origin)
      case ClientIdentifier.SignTransaction:
        return this.client.signTransaction(params, origin)
      case ClientIdentifier.SendTransaction:
        return this.client.sendTransaction(params, origin)
      case ClientIdentifier.GetChainId:
        return this.client.getChainId(params, origin)

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
  // eslint-disable-next-line
  async handleAdmin(method: string, params: any) {
    switch (method) {
      // Wallets
      case AdminIdentifier.ListWallets:
        return notImplemented()
      case AdminIdentifier.CreateWallet:
        return notImplemented()
      case AdminIdentifier.ImportWallet:
        return notImplemented()
      case AdminIdentifier.DescribeWallet:
        return notImplemented()
      case AdminIdentifier.RenameWallet:
        return notImplemented()
      case AdminIdentifier.RemoveWallet:
        return notImplemented()

      // Network
      case AdminIdentifier.ListNetworks:
        return this.networks.list()
      case AdminIdentifier.ImportNetwork:
        return this.networks.import(params)
      case AdminIdentifier.DescribeNetwork:
        return this.networks.describe(params)
      case AdminIdentifier.UpdateNetwork:
        return this.networks.update(params)
      case AdminIdentifier.RemoveNetwork:
        return this.networks.remove(params)

      // Keys
      case AdminIdentifier.GenerateKey:
        return notImplemented()
      case AdminIdentifier.DescribeKey:
        return notImplemented()
      case AdminIdentifier.ListKeys:
        return notImplemented()
      case AdminIdentifier.AnnotateKey:
        return notImplemented()
      case AdminIdentifier.IsolateKey:
        return notImplemented()
      case AdminIdentifier.RotateKey:
        return notImplemented()
      case AdminIdentifier.TaintKey:
        return notImplemented()
      case AdminIdentifier.UntaintKey:
        return notImplemented()

      // Permissions
      case AdminIdentifier.DescribePermissions:
        return notImplemented()
      case AdminIdentifier.ListPermissions:
        return notImplemented()
      case AdminIdentifier.UpdatePermissions:
        return notImplemented()
      case AdminIdentifier.RevokePermissions:
        return notImplemented()
      case AdminIdentifier.PurgePermissions:
        return notImplemented()

      // Transactions
      case AdminIdentifier.SignTransaction:
        return notImplemented()
      case AdminIdentifier.SignMessage:
        return notImplemented()
      case AdminIdentifier.VerifyMessage:
        return notImplemented()
      case AdminIdentifier.SendTransaction:
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
