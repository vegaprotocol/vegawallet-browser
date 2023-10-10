import { useFormatAssetAmount } from '../../../hooks/format-asset-amount'
import { Header } from '../../header'
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
      <Header content={<AmountWithSymbol amount={formattedAmount} symbol={symbol} />} />
    </BaseWithdrawal>
  )
}
