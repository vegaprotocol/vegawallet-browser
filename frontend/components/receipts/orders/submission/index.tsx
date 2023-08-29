import { ReceiptComponentProps } from '../../receipts'
import { OrderBadges } from '../../utils/order-badges'
import { OrderTable } from '../../utils/order-table'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'

export const Submission = ({ transaction }: ReceiptComponentProps) => {
  const submission = transaction.orderSubmission

  if (submission.peggedOrder || submission.icebergOpts) return null
  return (
    <ReceiptWrapper>
      <OrderTable {...submission} />
      <OrderBadges {...submission} />
    </ReceiptWrapper>
  )
}
