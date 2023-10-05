import { vegaMarket } from '@vegaprotocol/rest-clients/dist/trading-data'
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
  market: vegaMarket | undefined
}) => {
  if (marketsLoading || !market) {
    return <MarketLink key="order-details-market" marketId={marketId} />
  }

  return <div data-testid={locators.orderDetailsMarketCode}>{market?.tradableInstrument?.instrument?.code}</div>
}
