import { vegaOrderType } from '@vegaprotocol/rest-clients/dist/trading-data'
import get from 'lodash/get'

import { useFormatMarketPrice } from '@/hooks/format-market-price/format-market-price.tsx'
import { useMarketSettlementAsset } from '@/hooks/market-settlement-asset/market-settlement-asset.tsx'

import { AmountWithSymbol } from '../string-amounts/amount-with-symbol.tsx'
import { PriceWithTooltip } from '../string-amounts/price-with-tooltip.tsx'

export const locators = {
  orderDetailsMarketPrice: 'order-details-market-price'
}

export const OrderPrice = ({ price, marketId, type }: { price: string; marketId: string; type?: vegaOrderType }) => {
  const asset = useMarketSettlementAsset(marketId)
  const symbol = get(asset, 'symbol')
  const formattedPrice = useFormatMarketPrice(marketId, price)
  if (type === vegaOrderType.TYPE_MARKET) return <div data-testid="order-details-market-price">Market price</div>

  if (!formattedPrice || !symbol) {
    return <PriceWithTooltip marketId={marketId} price={price} />
  }

  return <AmountWithSymbol amount={formattedPrice} symbol={symbol} />
}
