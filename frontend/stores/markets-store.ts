import { create } from 'zustand'
import { RpcMethods } from '../lib/client-rpc-methods.ts'
import { SendMessage } from '../contexts/json-rpc/json-rpc-provider.tsx'
import { removePaginationWrapper } from '../lib/remove-pagination.ts'
import { VegaMarket } from '../types/rest-api.ts'

const getSettlementAssetId = (market: VegaMarket) => {
  const assetId =
    market.tradableInstrument?.instrument?.future?.settlementAsset ??
    market.tradableInstrument?.instrument?.perpetual?.settlementAsset
  if (!assetId) {
    throw new Error(`Could not find settlement asset from market ${market.id}`)
  }
  return assetId
}

export type MarketsStore = {
  markets: VegaMarket[]
  loading: boolean
  fetchMarkets: (request: SendMessage) => Promise<void>
  getMarketById: (id: string) => VegaMarket
  getMarketsByAssetId: (assetId: string) => VegaMarket[]
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
  },
  getMarketsByAssetId(assetId: string) {
    const markets = get().markets.filter((market) => getSettlementAssetId(market) === assetId)
    return markets
  }
}))
