import { TransactionSwitch } from '../../receipts'
import { ReceiptComponentProps } from '../../receipts/receipts'
import { hasReceiptView } from '../../receipts/transaction-map'

export const EnrichedDetails = ({ transaction }: ReceiptComponentProps) => {
  const renderReceipt = hasReceiptView(transaction)
  return renderReceipt ? <TransactionSwitch transaction={transaction} /> : null
}
