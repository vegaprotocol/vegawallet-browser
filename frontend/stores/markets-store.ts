import { create } from 'zustand'
import { RpcMethods } from '../lib/client-rpc-methods.ts'
import { SendMessage } from '../contexts/json-rpc/json-rpc-provider.tsx'
import type { Market } from '@vegaprotocol/types'

export type MarketsStore = {
  markets: Market[]
  loading: boolean
  fetchMarkets: (request: SendMessage) => Promise<void>
  getMarketById: (id: string) => Market
}

export const useMarketsStore = create<MarketsStore>((set, get) => ({
  markets: [],
  loading: false,
  async fetchMarkets(request) {
    try {
      set({ loading: true })
      const markets = await request(RpcMethods.Fetch, { path: 'api/v2/markets' })
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
