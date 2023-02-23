import type { WalletModel } from '@vegaprotocol/wallet-client'

import type { WalletStore } from '../storage'
import { Interactor } from './interactor'
import { EventBus, Implementation } from '../events'

export class Client {
  private origin: string
  private store: WalletStore
  private interactor: Interactor

  constructor(
    origin: string,
    store: WalletStore,
    implementation: Implementation
  ) {
    this.origin = origin
    this.store = store
    this.interactor = new Interactor({
      bus: new EventBus(implementation),
      store,
    })
  }

  async connect(): Promise<WalletModel.ConnectWalletResult> {
    const wallets = await this.store.wallets.keys()

    try {
      const { approvedForWallet } = await this.interactor.connectWallet({
        origin: this.origin,
        wallets,
      })

      if (approvedForWallet) {
        await this.store.connections.set(this.origin, {
          wallet: approvedForWallet,
          origin,
          permissions: {
            publicKeys: {
              access: 'read',
              allowedKeys: [],
            },
          },
        })
      }
    } catch (err) {
      // @TODO log error to somewhere?
    }

    return null
  }

  async disconnect(): Promise<WalletModel.DisconnectWalletResult> {
    const connection = await this.store.connections.get(this.origin)

    if (!connection) {
      throw new Error('Connection not found')
    }

    await this.store.connections.delete(this.origin)
    return connection
  }

  async listKeys(): Promise<WalletModel.ListKeysResult> {
    const connection = await this.store.connections.get(this.origin)

    if (!connection) {
      throw new Error('Connection not found')
    }

    const wallet = await this.store.wallets.get(connection.wallet)

    if (!wallet) {
      throw new Error('Wallet not found')
    }

    switch (connection.permissions.publicKeys.access) {
      case 'read': {
        return {
          keys: wallet.keys.map((k) => ({
            name: k.metadata.find((m) => m.key === 'name')?.value ?? '',
            publicKey: k.publicKey,
          })),
        }
      }
      default: {
        return {
          keys: [],
        }
      }
    }
  }

  async sendTransaction(
    params: WalletModel.SendTransactionParams
  ): Promise<WalletModel.SendTransactionResult> {
    throw new Error('Not implemented')
  }

  async signTransaction(
    params: WalletModel.SignTransactionParams
  ): Promise<WalletModel.SignTransactionResult> {
    throw new Error('Not implemented')
  }

  async getChainId(): Promise<WalletModel.GetChainIdResult> {
    throw new Error('Not implemented')
  }
}
