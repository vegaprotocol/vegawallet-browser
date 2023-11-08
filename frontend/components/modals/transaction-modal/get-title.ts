import { TransactionKeys, TRANSACTION_TITLES, Transaction } from '../../../lib/transactions'

export const U_INT_64_MAX = '18446744073709551615'

const processTitle = (type: TransactionKeys, data: any) => {
  // If we have a mass order cancellation (i.e. no order ID, with or without a market ID)
  // then we want to display a different title
  if (type === TransactionKeys.ORDER_CANCELLATION && data && data.orderId) {
    return 'Mass Order Cancellation'
  } else if (type === TransactionKeys.ORDER_SUBMISSION && data && data.reduceOnly && data.size === U_INT_64_MAX) {
    return 'Close Position'
  }

  return TRANSACTION_TITLES[type]
}

export const getBatchTitle = (type: TransactionKeys, data: any) => {
  return processTitle(type, data)
}

export const getTitle = (transaction: Transaction) => {
  const type = Object.keys(transaction)[0] as TransactionKeys

  return processTitle(type, transaction[type])
}
