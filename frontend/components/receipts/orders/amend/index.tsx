import { ReceiptComponentProps } from '../../receipts'
import { OrderBadges } from '../../utils/order-badges'
import { OrderTable } from '../../utils/order-table'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'

export const Amendment = ({ transaction }: ReceiptComponentProps) => {
  const amendment = transaction.orderAmendment
  return (
    <ReceiptWrapper type="Order Amendment">
      <OrderTable {...amendment} />
      <OrderBadges {...amendment} />
    </ReceiptWrapper>
  )
}
