import { ReceiptComponentProps } from '../receipts'
import { BasicTransferView } from './basic-transfer-view'
import { EnrichedTransferView } from './enriched-transfer-view'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const locators = {
  whenSection: 'when-section',
  whenElement: 'when-element',
  loading: 'loading'
}

export const Transfer = ({ transaction }: ReceiptComponentProps) => {
  // Not supporting recurring transfers yet
  if (transaction.transfer.recurring) return null

  return (
    <ReceiptWrapper
      unenrichedState={<BasicTransferView transaction={transaction} />}
      loadingState={<BasicTransferView transaction={transaction} />}
    >
      <EnrichedTransferView transaction={transaction} />
    </ReceiptWrapper>
  )
}
