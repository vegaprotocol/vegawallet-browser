import { ReceiptComponentProps } from '../../receipts'
import { OrderTable } from '../../utils/order-table'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'

export const Cancellation = ({ transaction }: ReceiptComponentProps) => {
  const cancellation = transaction.orderCancellation
  return (
    <ReceiptWrapper>
      <OrderTable {...cancellation} />
    </ReceiptWrapper>
  )
}
