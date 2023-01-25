import { NetworkSchema, Network } from './schemas/network'
import { Storage } from './wrapper'
import { Engine } from './types/engine'

export class WalletStore {
  public networks: Storage<Network>

  constructor(engine: Engine) {
    this.networks = new Storage('networks', NetworkSchema, engine)
  }
}
