import { create } from 'zustand'
import { SendMessage } from '../contexts/json-rpc/json-rpc-provider'
import { RpcMethods } from '../lib/client-rpc-methods'

export interface Wallet {
  name: string
  keys: Key[]
}

export interface Key {
  index: number
  metadata: Metadata[]
  name: string
  publicKey: string
}

export interface Metadata {
  key: string
  value: string
}

export type WalletsStore = {
  wallets: Wallet[]
  loading: boolean
  _loadWallets: (request: SendMessage) => Promise<void>
  loadWallets: (request: SendMessage) => Promise<void>
  reloadWallets: (request: SendMessage) => Promise<void>
  createKey: (request: SendMessage, walletName: string) => Promise<void>
  getKeyById: (pubKey: string) => Key | undefined
}

export const useWalletStore = create<WalletsStore>()((set, get) => ({
  wallets: [],
  loading: true,
  async createKey(request: SendMessage, walletName: string) {
    const wallets = get().wallets
    const wallet = wallets.find(({ name }) => name === walletName)
    if (!wallet) {
      throw new Error('Could not find wallet to create key for')
    }
    const newKey = await request(RpcMethods.GenerateKey, {
      wallet: wallet.name,
      name: `Key ${wallet.keys.length + 1}`
    })
    const newWallets = [
      ...wallets.filter(({ name }) => name !== walletName),
      {
        ...wallet,
        keys: [...wallet.keys, newKey]
      }
    ]
    set({
      wallets: newWallets
    })
  },
  async _loadWallets(request: SendMessage) {
    const { wallets } = await request(RpcMethods.ListWallets, null)
    const res = await Promise.all(
      wallets.map(async (w: string) => {
        const keyList = await request(RpcMethods.ListKeys, {
          wallet: w
        })
        const { keys } = keyList
        return { name: w, keys }
      })
    )
    set({ wallets: res })
  },
  async reloadWallets(request: SendMessage) {
    await get()._loadWallets(request)
  },
  async loadWallets(request: SendMessage) {
    try {
      set({ loading: true })
      await get()._loadWallets(request)
    } finally {
      set({ loading: false })
    }
  },
  getKeyById: (pubKey: string) =>
    get()
      .wallets.flatMap((w) => w.keys)
      .find(({ publicKey }) => publicKey === pubKey)
}))
