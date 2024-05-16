import type { ReceiptComponentProperties } from '../../receipts'
import { OrderBadges } from '../../utils/order/badges'
import { OrderTable } from '../../utils/order-table'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'

export const locators = {
  icebergMessage: 'iceberg-message'
}

export const SubmissionView = ({ orderSubmission }: { orderSubmission: any }) => {
  if (orderSubmission.icebergOpts)
    return <div data-testid={locators.icebergMessage}>Iceberg Order, see raw JSON for more information</div>
  return (
    <>
      <OrderTable {...orderSubmission} />
      <OrderBadges {...orderSubmission} />
    </>
  )
}

export const Submission = ({ transaction }: ReceiptComponentProperties) => {
  const orderSubmission = transaction.orderSubmission

  if (orderSubmission.icebergOpts) return null
  return (
    <ReceiptWrapper>
      <SubmissionView orderSubmission={orderSubmission} />
    </ReceiptWrapper>
  )
}
