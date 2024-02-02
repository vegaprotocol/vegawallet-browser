import get from 'lodash/get'

import { useMarketsStore } from '@/stores/markets-store'

import { MarketLink } from './market-link'

export const locators = {
  vegaMarketCode: 'order-details-market-code'
}

export const VegaMarket = ({ marketId }: { marketId: string }) => {
  const { getMarketById, loading } = useMarketsStore((state) => ({
    loading: state.loading,
    getMarketById: state.getMarketById
  }))
  if (loading) {
    return <MarketLink marketId={marketId} />
  }
  const market = getMarketById(marketId)
  const code = get(market, 'tradableInstrument.instrument.code')
  if (!code) {
    return <MarketLink marketId={marketId} />
  }

  return <div data-testid={locators.vegaMarketCode}>{code}</div>
}
