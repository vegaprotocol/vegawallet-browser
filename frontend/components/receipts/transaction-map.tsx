import { Transaction, TransactionKeys } from '../../lib/transactions'
import { ReceiptMap } from './receipts'
import { Transfer } from './transfer'

export const hasReceiptView = (transaction: Transaction) => {
  const type = Object.keys(transaction)[0] as TransactionKeys
  const Component = TransactionMap[type]
  return !!Component
}

export const TransactionMap: Partial<ReceiptMap> = {
  [TransactionKeys.TRANSFER]: Transfer
}
