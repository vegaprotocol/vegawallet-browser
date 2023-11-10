import { SizeWithTooltip } from '../string-amounts/size-with-tooltip'
import { AmountWithSymbol } from '../string-amounts/amount-with-symbol'
import { useFormatSizeAmount } from '../../../../hooks/format-size-amount'

export const OrderSizeComponent = ({ size, marketId }: { size: string; marketId: string }) => {
  const formattedSize = useFormatSizeAmount(marketId, size)

  if (!formattedSize) {
    return <SizeWithTooltip key="order-details-size" marketId={marketId} size={size} />
  }

  return <AmountWithSymbol amount={formattedSize} />
}
