import { TransactionKeys } from '../../lib/transactions'
import { ReceiptComponentProps, ReceiptMap } from './receipts'
import { Transfer } from './transfer'

export const TransactionMap: Partial<ReceiptMap> = {
  [TransactionKeys.TRANSFER]: Transfer
}

export const TransactionSwitch = ({ transaction }: ReceiptComponentProps) => {
  const type = Object.keys(transaction)[0] as TransactionKeys
  const Component = TransactionMap[type]
  if (Component) return <Component transaction={transaction} />
  return null
}
