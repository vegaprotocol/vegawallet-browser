import { TransactionKeys } from '../../lib/transactions'
import { Transfer } from '../receipts/transfer'
import { VegaSection } from '../vega-section'

const TransactionSwitch = ({ transaction }: { transaction: any }) => {
  const type = Object.keys(transaction)[0]
  if (type === TransactionKeys.TRANSFER) {
    return <Transfer transaction={transaction} />
  }
  return null
}

export const EnrichedDetails = ({ transaction }: { transaction: any }) => {
  const TxSwitch = <TransactionSwitch transaction={transaction} />
  return TxSwitch ? (
    <VegaSection>
      <TransactionSwitch transaction={transaction} />
    </VegaSection>
  ) : null
}
