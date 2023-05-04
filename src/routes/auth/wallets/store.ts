import { create } from 'zustand'
import JSONRPCClient from '../../../lib/json-rpc-client'

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
  error: string | null
  loadWallets: (client: JSONRPCClient) => void
  createKey: (client: JSONRPCClient, walletName: string) => void
}

export const useWalletStore = create<WalletsStore>()((set, get) => ({
  wallets: [],
  loading: true,
  error: null,
  createKey: async (client: JSONRPCClient, walletName: string) => {
    const wallets = get().wallets
    const wallet = wallets.find(({ name }) => name === walletName)
    if (!wallet) {
      set({ error: 'Could not find wallet to create key for' })
      return
    }
    const newKey = await client.request('admin.generate_key', {
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
  loadWallets: async (client: JSONRPCClient) => {
    try {
      set({ loading: true, error: null })
      const { wallets } = await client.request('admin.list_wallets', null)
      const res = await Promise.all(
        wallets.map(async (w: string) => {
          const keyList = await client.request('admin.list_keys', {
            wallet: w
          })
          const { keys } = keyList
          return { name: w, keys }
        })
      )
      set({ wallets: res })
    } catch (e) {
      set({ error: e?.toString() || 'Something went wrong' })
    } finally {
      set({ loading: false })
    }
  }
}))
