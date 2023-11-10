import { vegaMarket } from '@vegaprotocol/rest-clients/dist/trading-data'
import { MarketLink } from './market-link'
import get from 'lodash/get'

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
  const code = get(market, 'tradableInstrument.instrument.code')
  if (marketsLoading || !code) {
    return <MarketLink key="order-details-market" marketId={marketId} />
  }

  return <div data-testid={locators.orderDetailsMarketCode}>{code}</div>
}
