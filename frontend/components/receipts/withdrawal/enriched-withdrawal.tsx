import { useFormatAssetAmount } from '../../../hooks/format-asset-amount'
import { AmountWithSymbol } from '../utils/string-amounts/amount-with-symbol'
import { BaseWithdrawal } from './base-withdrawal'

export const EnrichedWithdrawal = ({
  amount,
  asset,
  receiverAddress
}: {
  receiverAddress: string
  amount: string
  asset: string
}) => {
  const { formattedAmount, symbol } = useFormatAssetAmount(asset, amount)
  return (
    <BaseWithdrawal receiverAddress={receiverAddress}>
      <AmountWithSymbol amount={formattedAmount} symbol={symbol} />
    </BaseWithdrawal>
  )
}
