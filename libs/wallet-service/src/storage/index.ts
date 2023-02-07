import { NetworkSchema, Network } from './schemas/network'
import { WalletSchema, Wallet } from './schemas/wallet'
import { Storage } from './wrapper'
import { Engine } from './types/engine'

export class WalletStore {
  public networks: Storage<Network>
  public wallets: Storage<Wallet>
  public keys: Storage<Wallet>

  constructor(engine: Engine) {
    this.networks = new Storage('networks', NetworkSchema, engine)
    this.wallets = new Storage('wallets', WalletSchema, engine)
    this.keys = this.wallets
  }
}
