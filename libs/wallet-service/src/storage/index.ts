import { NetworkSchema, Network } from './schemas/network'
import { WalletSchema, Wallet } from './schemas/wallet'
import { ConnectionSchema, Connection } from './schemas/connection'
import { Storage } from './wrapper'
import { Engine } from './types/engine'

export class WalletStore {
  public networks: Storage<Network>
  public wallets: Storage<Wallet>
  public connections: Storage<Connection>
  public keys: Storage<Wallet>

  constructor(engine: Engine) {
    this.networks = new Storage('networks', NetworkSchema, engine)
    this.wallets = new Storage('wallets', WalletSchema, engine)
    this.connections = new Storage('connections', ConnectionSchema, engine)
    this.keys = this.wallets
  }
}
