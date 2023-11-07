import { TransactionKeys } from '../../../lib/transactions'
import { getTitle, U_INT_64_MAX } from './get-title'

describe('getTitle', () => {
  it('should return the title corresponding to the given TransactionKeys', () => {
    const transaction = {
      [TransactionKeys.ORDER_SUBMISSION]: { orderId: '1' }
    }
    expect(getTitle(transaction as any)).toBe('Order Submission')

    const anotherTransaction = {
      [TransactionKeys.VOTE_SUBMISSION]: { someData: 'value' }
    }
    expect(getTitle(anotherTransaction as any)).toBe('Vote Submission')
  })

  it('should return "Mass Order Cancellation" when order cancellation has no orderId', () => {
    const transaction = {
      [TransactionKeys.ORDER_CANCELLATION]: { marketId: 'some-market-id' } // Missing orderId
    }
    expect(getTitle(transaction as any)).toBe('Mass Order Cancellation')
  })

  it('should return "Order Cancellation" when order cancellation has an orderId', () => {
    const transaction = {
      [TransactionKeys.ORDER_CANCELLATION]: { marketId: 'some-market-id', orderId: 'some-order-id' }
    }
    expect(getTitle(transaction as any)).toBe('Order Cancellation')
  })

  it('should return "Close position" when order submission is reduceOnly with max size', () => {
    const transaction = {
      [TransactionKeys.ORDER_CANCELLATION]: { reduceOnly: true, size: U_INT_64_MAX }
    }
    expect(getTitle(transaction as any)).toBe('Order Cancellation')
  })

  it('should return "Unknown" for unrecognized TransactionKeys', () => {
    const transaction = {
      [TransactionKeys.UNKNOWN]: {}
    }
    expect(getTitle(transaction as any)).toBe('Unknown')
  })
})
