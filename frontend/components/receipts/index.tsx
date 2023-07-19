import { TransactionKeys } from '../../lib/transactions'
import { ReceiptComponentProps } from './receipts'
import { TransactionMap } from './transaction-map'

export const TransactionSwitch = ({ transaction }: ReceiptComponentProps) => {
  const type = Object.keys(transaction)[0] as TransactionKeys
  const Component = TransactionMap[type]
  if (Component) return <Component transaction={transaction} />
  return null
}
