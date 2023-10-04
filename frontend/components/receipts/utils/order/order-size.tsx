import { SizeWithTooltip } from '../string-amounts/size-with-tooltip'
import { PriceWithSymbol } from '../string-amounts/price-with-symbol'

export const OrderSizeComponent = ({
  marketsLoading,
  size,
  marketId,
  formattedSize,
  symbol
}: {
  marketsLoading: boolean
  size: string
  marketId: string
  formattedSize: string | undefined
  symbol: string | undefined
}) => {
  if (marketsLoading || !formattedSize || !symbol) {
    return <SizeWithTooltip key="order-details-size" marketId={marketId} size={size} />
  }

  return <PriceWithSymbol price={formattedSize} symbol={symbol} />
}
