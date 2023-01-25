import {
  INTERACTION_TYPE,
  PermissionTarget,
  PermissionType,
} from '@vegaprotocol/wallet-ui'

import { EventBus } from '../../events'

export class Interactor {
  private bus: EventBus

  constructor(eventBus: EventBus) {
    this.bus = eventBus
  }

  async startInteraction() {
    return this.bus.emit(INTERACTION_TYPE.INTERACTION_SESSION_BEGAN)
  }
  async endInteraction() {
    return this.bus.emit(INTERACTION_TYPE.INTERACTION_SESSION_ENDED)
  }

  async requestWalletConnection({ origin }: { origin: string }) {
    return this.bus.emit(INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW, {
      hostname: origin,
    })
  }

  async requestWalletSelection({
    origin,
    wallets,
  }: {
    origin: string
    wallets: string[]
  }) {
    return this.bus.emit(INTERACTION_TYPE.REQUEST_WALLET_SELECTION, {
      hostname: origin,
      availableWallets: wallets,
    })
  }

  async requestPermissionsReview({
    origin,
    wallet,
    permissions,
  }: {
    origin: string
    wallet: string
    permissions: Record<PermissionTarget, PermissionType>
  }) {
    return this.bus.emit(INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW, {
      hostname: origin,
      wallet,
      permissions,
    })
  }

  async requestTransactionReview({
    origin,
    wallet,
    publicKey,
    transaction,
    receivedAt,
  }: {
    origin: string
    wallet: string
    publicKey: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transaction: any
    receivedAt: string
  }) {
    return this.bus.emit(
      INTERACTION_TYPE.REQUEST_TRANSACTION_REVIEW_FOR_SENDING,
      {
        hostname: origin,
        wallet,
        publicKey,
        transaction,
        receivedAt,
      }
    )
  }

  async requestTransactionSucceded({
    txHash,
    tx,
    deserializedInputData,
    sentAt,
  }: {
    txHash: string
    tx: string
    deserializedInputData: string
    sentAt: string
  }) {
    return this.bus.emit(INTERACTION_TYPE.TRANSACTION_SUCCEEDED, {
      txHash,
      tx,
      deserializedInputData,
      sentAt,
    })
  }

  async requestTransactionFailed({
    tx,
    deserializedInputData,
    error,
    sentAt,
  }: {
    tx: string
    deserializedInputData: string
    error: string
    sentAt: string
  }) {
    return this.bus.emit(INTERACTION_TYPE.TRANSACTION_FAILED, {
      tx,
      deserializedInputData,
      error,
      sentAt,
    })
  }

  async requestPassphrase({ wallet }: { wallet: string }) {
    return this.bus.emit(INTERACTION_TYPE.REQUEST_PASSPHRASE, {
      wallet,
    })
  }

  async requestSucceeded({ message }: { message: string }) {
    return this.bus.emit(INTERACTION_TYPE.REQUEST_SUCCEEDED, {
      message,
    })
  }

  async requestError({ name, error }: { name: string; error: string }) {
    return this.bus.emit(INTERACTION_TYPE.ERROR_OCCURRED, {
      name,
      error,
    })
  }

  async requestLog({
    type,
    message,
  }: {
    type: 'Info' | 'Warning' | 'Error' | 'Success'
    message: string
  }) {
    return this.bus.emit(INTERACTION_TYPE.LOG, {
      type,
      message,
    })
  }
}
