import { ReceiptComponentProps } from '../../receipts'
import { OrderBadges } from '../../utils/order/badges'
import { OrderTable } from '../../utils/order-table'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'

export const SubmissionView = ({ orderSubmission }: { orderSubmission: any }) => {
  if (orderSubmission.icebergOpts) return <div>Iceberg Order, see raw JSON for more information</div>
  return (
    <>
      <OrderTable {...orderSubmission} />
      <OrderBadges {...orderSubmission} />
    </>
  )
}

export const Submission = ({ transaction }: ReceiptComponentProps) => {
  const orderSubmission = transaction.orderSubmission

  if (orderSubmission.icebergOpts) return null
  return (
    <ReceiptWrapper>
      <SubmissionView orderSubmission={orderSubmission} />
    </ReceiptWrapper>
  )
}
