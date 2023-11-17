import { TransactionKeys, TRANSACTION_TITLES, Transaction, MAX_POSITION_SIZE } from '../../../lib/transactions'

const processTitle = (type: TransactionKeys, data: any) => {
  // If we have a mass order cancellation (i.e. no order ID, with or without a market ID)
  // then we want to display a different title
  if (type === TransactionKeys.ORDER_CANCELLATION && data && !data.orderId) {
    return 'Mass Order Cancellation'
  } else if (type === TransactionKeys.ORDER_SUBMISSION && data && data.reduceOnly && data.size === MAX_POSITION_SIZE) {
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
