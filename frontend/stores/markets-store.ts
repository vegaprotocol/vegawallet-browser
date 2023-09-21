import { create } from 'zustand'
import { RpcMethods } from '../lib/client-rpc-methods.ts'
import { SendMessage } from '../contexts/json-rpc/json-rpc-provider.tsx'
import { removePaginationWrapper } from '../lib/remove-pagination.ts'
import { VegaMarket } from '../types/rest-api.ts'

export type MarketsStore = {
  markets: VegaMarket[]
  loading: boolean
  fetchMarkets: (request: SendMessage) => Promise<void>
  getMarketById: (id: string) => VegaMarket
}

export const useMarketsStore = create<MarketsStore>((set, get) => ({
  markets: [],
  loading: false,
  async fetchMarkets(request) {
    try {
      set({ loading: true })
      const response = await request(RpcMethods.Fetch, { path: 'api/v2/markets' })
      const markets = removePaginationWrapper<VegaMarket>(response.markets.edges)
      set({ markets })
    } finally {
      set({ loading: false })
    }
  },
  getMarketById(id: string) {
    const market = get().markets.find((market) => market.id === id)
    if (!market) {
      throw new Error(`Market with id ${id} not found`)
    }
    return market
  }
}))
