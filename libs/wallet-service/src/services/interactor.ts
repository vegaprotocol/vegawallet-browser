import { v4 as uuid } from 'uuid'

import { WalletStore } from '../storage'
import { EventBus } from '../events'

type GetTraceId = () => string

type Props = {
  bus: EventBus
  store: WalletStore
  getTraceID?: GetTraceId
}

type ConnectProps = {
  origin: string
  wallets: string[]
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

  async connectWallet({
    origin,
    wallets,
  }: ConnectProps): Promise<{ approvedForWallet?: string }> {
    const traceID = this.getTraceID()

    await this.bus.emit({
      traceID,
      name: 'INTERACTION_SESSION_BEGAN',
    })

    const {
      data: { connectionApproval },
    } = await this.bus.emit({
      traceID,
      name: 'REQUEST_WALLET_CONNECTION_REVIEW',
      data: {
        hostname: origin,
      },
    })

    if (connectionApproval === 'REJECTED_ONLY_THIS_TIME') {
      throw new Error(`User rejected the connection request from ${origin}`)
    }

    const {
      data: { wallet },
    } = await this.bus.emit({
      traceID,
      name: 'REQUEST_WALLET_SELECTION',
      data: {
        hostname: origin,
        availableWallets: wallets,
      },
    })

    return { approvedForWallet: wallet }
  }

  async reviewTransaction() {
    throw new Error('Not implemented')
  }

  async requestPermission() {
    throw new Error('Not implemented')
  }
}
