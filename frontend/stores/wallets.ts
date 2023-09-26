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
  loadWallets: (client: SendMessage) => Promise<void>
  createKey: (client: SendMessage, walletName: string) => Promise<void>
  getKeyInfo: (pubKey: string) => Key | undefined
}

export const useWalletStore = create<WalletsStore>()((set, get) => ({
  wallets: [],
  loading: true,
  createKey: async (request: SendMessage, walletName: string) => {
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
  loadWallets: async (request: SendMessage) => {
    try {
      set({ loading: true })
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
    } finally {
      set({ loading: false })
    }
  },
  getKeyInfo: (pubKey: string) =>
    get()
      .wallets.flatMap((w) => w.keys)
      .find(({ publicKey }) => publicKey === pubKey)
}))
