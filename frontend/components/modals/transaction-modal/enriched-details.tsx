import { TransactionSwitch } from '../../receipts'
import { ReceiptComponentProps } from '../../receipts/receipts'
import { hasReceiptView } from '../../receipts/transaction-map'
import { VegaSection } from '../../vega-section'

export const EnrichedDetails = ({ transaction }: ReceiptComponentProps) => {
  const renderReceipt = hasReceiptView(transaction)
  return renderReceipt ? (
    <VegaSection>
      <TransactionSwitch transaction={transaction} />
    </VegaSection>
  ) : null
}
