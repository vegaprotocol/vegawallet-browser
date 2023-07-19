import { TransactionKeys } from '../../lib/transactions'
import { ReceiptMap } from './receipts'
import { Transfer } from './transfer'

export const TransactionMap: Partial<ReceiptMap> = {
  [TransactionKeys.TRANSFER]: Transfer
}
