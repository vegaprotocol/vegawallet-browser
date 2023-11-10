import { MarketLink } from './market-link'
import get from 'lodash/get'
import { useMarketsStore } from '../../../../stores/markets-store'

export const locators = {
  orderDetailsMarketCode: 'order-details-market-code'
}

export const OrderMarketComponent = ({ marketId }: { marketId: string }) => {
  const { getMarketById } = useMarketsStore((state) => ({
    getMarketById: state.getMarketById
  }))
  const market = getMarketById(marketId)
  const code = get(market, 'tradableInstrument.instrument.code')
  if (!code) {
    return <MarketLink key="order-details-market" marketId={marketId} />
  }

  return <div data-testid={locators.orderDetailsMarketCode}>{code}</div>
}
