import { create } from 'zustand'
import { RpcMethods } from '../lib/client-rpc-methods.ts'
import { SendMessage } from '../contexts/json-rpc/json-rpc-provider.tsx'
import { removePaginationWrapper } from '../lib/remove-pagination.ts'
import { vegaMarket } from '@vegaprotocol/rest-clients/dist/trading-data'

export const getSettlementAssetId = (market: vegaMarket) => {
  const assetId =
    market.tradableInstrument?.instrument?.future?.settlementAsset ??
    market.tradableInstrument?.instrument?.perpetual?.settlementAsset
  if (!assetId) {
    throw new Error(`Could not find settlement asset from market ${market.id}`)
  }
  return assetId
}

export type MarketsStore = {
  markets: vegaMarket[]
  loading: boolean
  fetchMarkets: (request: SendMessage) => Promise<void>
  getMarketById: (id: string) => vegaMarket
  getMarketsByAssetId: (assetId: string) => vegaMarket[]
}

export const useMarketsStore = create<MarketsStore>((set, get) => ({
  markets: [],
  loading: true,
  async fetchMarkets(request) {
    try {
      set({ loading: true })
      const response = await request(RpcMethods.Fetch, { path: 'api/v2/markets' })
      const markets = removePaginationWrapper<vegaMarket>(response.markets.edges)
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
