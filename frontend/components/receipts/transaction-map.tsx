import { Transaction, TransactionKeys } from '../../lib/transactions'
import { Amendment } from './orders/amend'
import { Cancellation } from './orders/cancellation'
import { StopOrderCancellation } from './orders/stop-cancellation'
import { StopOrderSubmission } from './orders/stop-submission'
import { Submission } from './orders/submission'
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
  [TransactionKeys.ORDER_SUBMISSION]: Submission,
  [TransactionKeys.STOP_ORDERS_SUBMISSION]: StopOrderSubmission,
  [TransactionKeys.STOP_ORDERS_CANCELLATION]: StopOrderCancellation
}
