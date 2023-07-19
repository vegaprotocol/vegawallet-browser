import { TransactionKeys } from '../../lib/transactions'
import { TransactionMap } from '../receipts'
import { VegaSection } from '../vega-section'

const TransactionSwitch = ({ transaction }: { transaction: any }) => {
  const type = Object.keys(transaction)[0] as TransactionKeys
  const Component = TransactionMap[type]
  if (Component) return <Component transaction={transaction} />
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
