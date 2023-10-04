import { useAssetsStore } from '../../../stores/assets-store'
import { ReceiptComponentProps } from '../receipts'
import { BasicWithdrawal } from './basic-withdrawal'
import { EnrichedWithdrawal } from './enriched-withdrawal'

export const Withdraw = ({ transaction }: ReceiptComponentProps) => {
  const { loading } = useAssetsStore((state) => ({
    loading: state.loading
  }))

  const { receiverAddress } = transaction.withdrawSubmission.ext.erc20

  if (!transaction.withdrawSubmission.ext?.erc20) return null
  if (loading)
    return (
      <BasicWithdrawal
        receiverAddress={receiverAddress}
        amount={transaction.withdrawSubmission.amount}
        asset={transaction.withdrawSubmission.asset}
      />
    )

  return (
    <EnrichedWithdrawal
      receiverAddress={receiverAddress}
      amount={transaction.withdrawSubmission.amount}
      asset={transaction.withdrawSubmission.asset}
    />
  )
}
