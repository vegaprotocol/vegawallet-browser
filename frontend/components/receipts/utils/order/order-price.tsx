import { vegaOrderType } from '@vegaprotocol/rest-clients/dist/trading-data'
import { PriceWithTooltip } from '../string-amounts/price-with-tooltip.tsx'
import { PriceWithSymbol } from '../string-amounts/price-with-symbol.tsx'

export const locators = {
  orderDetailsMarketPrice: 'order-details-market-price'
}

export const OrderPriceComponent = ({
  assetsLoading,
  price,
  marketId,
  formattedPrice,
  symbol,
  type
}: {
  assetsLoading: boolean
  price: string | undefined
  marketId: string | undefined
  formattedPrice: string | undefined
  symbol: string | undefined
  type: vegaOrderType | undefined
}) => {
  if (type === vegaOrderType.TYPE_MARKET) return <div data-testid="order-details-market-price">Market price</div>

  if (!price || price === '0' || !marketId) return null

  if (assetsLoading || !formattedPrice || !symbol) {
    return <PriceWithTooltip key="order-details-price" marketId={marketId} price={price} />
  }

  return <PriceWithSymbol price={formattedPrice} symbol={symbol} />
}
