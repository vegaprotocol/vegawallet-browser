import { SizeWithTooltip } from '../string-amounts/size-with-tooltip'
import { AmountWithSymbol } from '../string-amounts/amount-with-symbol'

export const OrderSizeComponent = ({
  marketsLoading,
  size,
  marketId,
  formattedSize
}: {
  marketsLoading: boolean
  size: string
  marketId: string
  formattedSize: string | undefined
}) => {
  if (marketsLoading || !formattedSize) {
    return <SizeWithTooltip key="order-details-size" marketId={marketId} size={size} />
  }

  return <AmountWithSymbol amount={formattedSize} />
}
