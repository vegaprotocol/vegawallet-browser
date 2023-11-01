import { useAssetsStore } from '../../../stores/assets-store'
import { AsyncRenderer } from '../../async-renderer/async-renderer'
import { ReceiptComponentProps } from '../receipts'
import { BasicWithdrawal } from './basic-withdrawal'
import { EnrichedWithdrawal } from './enriched-withdrawal'

export const Withdraw = ({ transaction }: ReceiptComponentProps) => {
  const { loading, error } = useAssetsStore((state) => ({
    loading: state.loading,
    error: state.error
  }))

  if (!transaction.withdrawSubmission.ext?.erc20) return null
  const { receiverAddress } = transaction.withdrawSubmission.ext.erc20
  return (
    <AsyncRenderer
      loading={loading}
      error={error}
      errorView={() => {
        return (
          <BasicWithdrawal
            receiverAddress={receiverAddress}
            amount={transaction.withdrawSubmission.amount}
            asset={transaction.withdrawSubmission.asset}
          />
        )
      }}
      renderLoading={() => (
        <BasicWithdrawal
          receiverAddress={receiverAddress}
          amount={transaction.withdrawSubmission.amount}
          asset={transaction.withdrawSubmission.asset}
        />
      )}
      render={() => (
        <EnrichedWithdrawal
          receiverAddress={receiverAddress}
          amount={transaction.withdrawSubmission.amount}
          asset={transaction.withdrawSubmission.asset}
        />
      )}
    />
  )
}
