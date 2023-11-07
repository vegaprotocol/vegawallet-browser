import { TransactionKeys, TRANSACTION_TITLES, Transaction } from '../../../lib/transactions'

export const U_INT_64_MAX = '18446744073709551615'

export const getTitle = (transaction: Transaction) => {
  const type = Object.keys(transaction)[0] as TransactionKeys

  // If we have a mass order cancellation (i.e. no order ID, with or without a market ID)
  // then we want to display a different title
  if (
    type === TransactionKeys.ORDER_CANCELLATION &&
    transaction.orderCancellation &&
    !transaction.orderCancellation.orderId
  ) {
    return 'Mass Order Cancellation'
  } else if (
    type === TransactionKeys.ORDER_SUBMISSION &&
    transaction.orderSubmission.reduceOnly &&
    transaction.orderSubmission.size === U_INT_64_MAX
  ) {
    return 'Close position'
  }

  return TRANSACTION_TITLES[type]
}
