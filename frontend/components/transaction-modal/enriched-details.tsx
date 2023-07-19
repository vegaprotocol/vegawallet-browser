import { TransactionSwitch } from '../receipts'
import { ReceiptComponentProps } from '../receipts/receipts'
import { VegaSection } from '../vega-section'

export const EnrichedDetails = ({ transaction }: ReceiptComponentProps) => {
  const TxSwitch = <TransactionSwitch transaction={transaction} />
  return TxSwitch ? (
    <VegaSection>
      <TransactionSwitch transaction={transaction} />
    </VegaSection>
  ) : null
}
