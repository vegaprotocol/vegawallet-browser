import type { WalletModel } from '@vegaprotocol/wallet-client'
import { CONNECTION_RESPONSE } from '@vegaprotocol/wallet-ui/src/types'

import type { WalletStore } from '../../storage'
import { Interactor } from '../interactor'
import { EventBus } from '../../events'

const MAX_TOKEN_CREATE_RETRIES = 3

// @TODO: add implementation for token generation
const generateToken = () => '1234567890'

export class Client {
  private sender: string
  private store: WalletStore
  private interactor: Interactor

  constructor(sender: string, store: WalletStore, eventBus: EventBus) {
    this.sender = sender
    this.store = store
    this.interactor = new Interactor(eventBus)
  }

  private createToken(retries?: number): string {
    const token = generateToken()
    if (!this.store.connections.has(token)) {
      return token
    } else if (retries && retries < MAX_TOKEN_CREATE_RETRIES) {
      return this.createToken(retries ? retries + 1 : 1)
    }
    throw new Error('Cannot create new connection token.')
  }

  async connect(): Promise<WalletModel.ConnectWalletResult> {
    const {
      data: { connectionApproval },
    } = await this.interactor.requestWalletConnection({ origin: this.sender })

    if (connectionApproval === CONNECTION_RESPONSE.APPROVED_ONCE) {
      const wallets = await this.store.wallets.values()

      const {
        data: { wallet },
      } = await this.interactor.requestWalletSelection({
        origin,
        wallets: wallets.map((w) => w.name),
      })

      // @TODO: implement passphrase check

      const token = this.createToken()

      await this.store.connections.set(origin, {
        token,
        wallet,
        origin,
        permissions: {
          publicKeys: {
            access: 'read',
            allowedKeys: [],
          },
        },
      })

      return { token }
    }

    throw new Error('Rejected by the user')
  }

  async disconnect(
    params: WalletModel.DisconnectWalletParams,
  ): Promise<WalletModel.DisconnectWalletResult> {
    const connection = await this.store.connections.get(origin)

    if (!connection) {
      throw new Error('Connection not found')
    }

    if (params.token === connection.token) {
      // @TODO: Implement disconnecting
    } else {
      throw new Error('Invalid token')
    }

    await this.store.connections.delete(connection.origin)
    return {}
  }

  async listKeys(
    params: WalletModel.ListKeysParams,
  ): Promise<WalletModel.ListKeysResult> {
    const connection = await this.store.connections.get(origin)

    if (!connection) {
      throw new Error('Connection not found')
    }

    if (connection.token !== params.token) {
      throw new Error('Invalid token')
    }

    const wallet = await this.store.wallets.get(connection.wallet)

    if (!wallet) {
      throw new Error('Wallet not found')
    }

    switch (connection.permissions.publicKeys.access) {
      case 'read': {
        // @TODO: add wallet keys
        return {
          keys: [],
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
    params: WalletModel.SendTransactionParams,
  ): Promise<WalletModel.SendTransactionResult> {
    throw new Error('Not implemented')
  }

  async signTransaction(
    params: WalletModel.SignTransactionParams,
  ): Promise<WalletModel.SignTransactionResult> {
    throw new Error('Not implemented')
  }

  async getChainId(
    params: WalletModel.GetChainIdParams,
  ): Promise<WalletModel.GetChainIdResult> {
    throw new Error('Not implemented')
  }
}
