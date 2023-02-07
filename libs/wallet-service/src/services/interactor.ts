import { v4 as uuid } from 'uuid'
import type { RequestWalletConnectionContent } from '@vegaprotocol/wallet-ui'

import { WalletStore } from '../storage'
import { EventBus } from '../events'

type GetTraceId = () => string

type Props = {
  bus: EventBus
  store: WalletStore
  getTraceID?: GetTraceId
}

export class Interactor {
  private bus: EventBus
  private store: WalletStore
  private getTraceID: GetTraceId

  constructor({ bus, store, getTraceID }: Props) {
    this.bus = bus
    this.store = store
    this.getTraceID = getTraceID ?? uuid
  }

  async connectWallet(data: RequestWalletConnectionContent) {
    throw new Error('Not implemented')
  }

  async reviewTransaction() {
    throw new Error('Not implemented')
  }

  async requestPermission() {
    throw new Error('Not implemented')
  }
}
