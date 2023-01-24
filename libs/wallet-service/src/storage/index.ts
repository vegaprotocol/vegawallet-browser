import { NetworkSchema, Network } from './schemas/network'
import { ConnectionSchema, Connection } from './schemas/connections'
import { WalletSchema, Wallet } from './schemas/wallet'
import { Storage } from './wrapper'
import { Engine } from './types/engine'

export class WalletStore {
  public networks: Storage<Network>
  public connections: Storage<Connection>
  public wallets: Storage<Wallet>

  constructor(engine: Engine) {
    this.networks = new Storage('networks', NetworkSchema, engine)
    this.connections = new Storage('networks', ConnectionSchema, engine)
    this.wallets = new Storage('wallets', WalletSchema, engine)
  }
}
