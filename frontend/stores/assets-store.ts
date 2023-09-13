import { create } from 'zustand'
import { RpcMethods } from '../lib/client-rpc-methods.ts'
import { SendMessage } from '../contexts/json-rpc/json-rpc-provider.tsx'
import type { Asset } from '@vegaprotocol/types'

export type AssetsStore = {
  assets: Asset[] | null
  loading: boolean
  error: string | null
  fetchAssets: (request: SendMessage) => Promise<void>
}

export const useAssetsStore = create<AssetsStore>((set, get) => ({
  assets: null,
  loading: false,
  error: null,
  async fetchAssets(request) {
    try {
      set({ loading: true, error: null })
      const assets = await request(RpcMethods.Fetch, { path: 'api/v2/assets' })
      set({ assets })
    } catch (error) {
      set({ error: 'Failed to fetch assets' })
    } finally {
      set({ loading: false })
    }
  }
}))
