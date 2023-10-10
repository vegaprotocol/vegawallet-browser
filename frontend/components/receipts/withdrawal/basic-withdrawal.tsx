import { Header } from '../../header'
import { AmountWithTooltip } from '../utils/string-amounts/amount-with-tooltip'
import { BaseWithdrawal } from './base-withdrawal'

export const BasicWithdrawal = ({
  amount,
  asset,
  receiverAddress
}: {
  receiverAddress: string
  amount: string
  asset: string
}) => {
  return (
    <BaseWithdrawal receiverAddress={receiverAddress}>
      <Header content={<AmountWithTooltip amount={amount} assetId={asset} />} />
    </BaseWithdrawal>
  )
}
