import { ReceiptComponentProps } from '../../receipts'
import { OrderBadges } from '../../utils/order-badges'
import { OrderTable } from '../../utils/order-table'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'

export const Cancellation = ({ transaction }: ReceiptComponentProps) => {
  const cancellation = transaction.orderCancellation
  return (
    <ReceiptWrapper type="Order Cancellation">
      <OrderTable {...cancellation} />
      <OrderBadges {...cancellation} />
    </ReceiptWrapper>
  )
}
