import { VegaMarket } from '../../../../types/rest-api'
import { MarketLink } from './market-link'

export const locators = {
  orderDetailsMarketCode: 'order-details-market-code'
}

export const OrderMarketComponent = ({
  marketsLoading,
  marketId,
  market
}: {
  marketsLoading: boolean
  marketId: string
  market: VegaMarket | undefined
}) => {
  if (marketsLoading || !market) {
    return <MarketLink key="order-details-market" marketId={marketId} />
  }

  return <div data-testid="order-details-market-code">{market?.tradableInstrument?.instrument?.code}</div>
}
