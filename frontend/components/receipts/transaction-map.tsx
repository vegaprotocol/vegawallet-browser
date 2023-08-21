import { Transaction, TransactionKeys } from '../../lib/transactions'
import { Amendment } from './orders/amend'
import { Cancellation } from './orders/cancel'
import { Submission } from './orders/submit'
import { ReceiptMap } from './receipts'
import { Transfer } from './transfer'
import { Withdraw } from './withdrawal'

export const hasReceiptView = (transaction: Transaction) => {
  const type = Object.keys(transaction)[0] as TransactionKeys
  const Component = TransactionMap[type]
  return !!Component
}

export const TransactionMap: Partial<ReceiptMap> = {
  [TransactionKeys.TRANSFER]: Transfer,
  [TransactionKeys.WITHDRAW_SUBMISSION]: Withdraw,
  [TransactionKeys.ORDER_AMENDMENT]: Amendment,
  [TransactionKeys.ORDER_CANCELLATION]: Cancellation,
  [TransactionKeys.ORDER_SUBMISSION]: Submission
}
