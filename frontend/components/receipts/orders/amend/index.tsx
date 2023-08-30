import { ReceiptComponentProps } from '../../receipts'
import { OrderBadges } from '../../utils/order/badges'
import { OrderTable } from '../../utils/order-table'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'

export const Amendment = ({ transaction }: ReceiptComponentProps) => {
  const amendment = transaction.orderAmendment
  if (amendment.pegged_offset || amendment.pegged_reference) return null
  return (
    <ReceiptWrapper>
      <OrderTable {...amendment} />
      <OrderBadges {...amendment} />
    </ReceiptWrapper>
  )
}
