import ReactTimeAgo from 'react-time-ago'
import { isBefore } from 'date-fns'
import { ReceiptComponentProps } from '../receipts'
import { Transaction } from '../../../lib/transactions'
import { BasicTransferView } from './basic-transfer-view'
import { EnrichedTransferView } from './enriched-transfer-view'
import { ReceiptWrapper } from '../utils/receipt-wrapper'
import { useAssetsStore } from '../../../stores/assets-store'
import { useWalletStore } from '../../../stores/wallets'
import { formatDate, nanoSecondsToMilliseconds } from '../../../lib/utils'
import { AsyncRenderer } from '../../async-renderer/async-renderer'

const getTime = (transaction: Transaction) => {
  const deliverOn = transaction.transfer.oneOff?.deliverOn
  if (deliverOn) {
    const date = nanoSecondsToMilliseconds(deliverOn)
    if (isBefore(date, new Date())) return null
    return date
  }
  return null
}

export const locators = {
  whenSection: 'when-section',
  whenElement: 'when-element',
  loading: 'loading'
}

export const Transfer = ({ transaction }: ReceiptComponentProps) => {
  const { loading: assetsLoading, error } = useAssetsStore((state) => ({
    loading: state.loading,
    error: state.error
  }))
  // We check whether wallets are loading as wallet data is used to enrich the transfer view
  const { loading: walletsLoading } = useWalletStore((state) => ({ loading: state.loading }))

  // Not supporting recurring transfers yet
  if (transaction.transfer.recurring) return null
  return (
    <AsyncRenderer
      loading={walletsLoading || assetsLoading}
      error={error}
      renderLoading={() => <BasicTransferView transaction={transaction} />}
      errorView={() => <BasicTransferView transaction={transaction} />}
      render={() => <EnrichedTransferView transaction={transaction} />}
    />
  )
}
