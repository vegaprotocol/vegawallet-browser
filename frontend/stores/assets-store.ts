import { create } from 'zustand'
import { RpcMethods } from '../lib/client-rpc-methods.ts'
import { SendMessage } from '../contexts/json-rpc/json-rpc-provider.tsx'
import type { Asset } from '@vegaprotocol/types'
import { removePaginationWrapper } from '../lib/remove-pagination.ts'

export type AssetsStore = {
  assets: Asset[]
  loading: boolean
  fetchAssets: (request: SendMessage) => Promise<void>
  getAssetById: (id: string) => Asset
}

export const useAssetsStore = create<AssetsStore>((set, get) => ({
  assets: [],
  loading: false,
  async fetchAssets(request) {
    try {
      set({ loading: true })
      const response = await request(RpcMethods.Fetch, { path: 'api/v2/assets' })
      const assets = removePaginationWrapper<Asset>(response.assets.edges)
      set({ assets })
    } finally {
      set({ loading: false })
    }
  },
  getAssetById(id: string) {
    const asset = get().assets.find((asset) => asset.id === id)
    if (!asset) {
      throw new Error(`Asset with id ${id} not found`)
    }
    return asset
  }
}))
