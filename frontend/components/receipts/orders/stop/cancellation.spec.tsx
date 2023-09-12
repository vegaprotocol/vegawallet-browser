import { render, screen } from '@testing-library/react'
import { StopOrderCancellation } from './cancellation'
import { locators as tableLocators } from '../../../data-table/data-table'

describe('StopOrderCancellation', () => {
  test('renders the component with market ID and stop order ID', () => {
    const transaction = {
      stopOrdersCancellation: {
        marketId: '1'.repeat(64),
        stopOrderId: '2'.repeat(64)
      }
    }

    render(<StopOrderCancellation transaction={transaction} />)
    const [market, order] = screen.getAllByTestId(tableLocators.dataRow)
    expect(market).toHaveTextContent('Market')
    expect(market).toHaveTextContent('111111…1111')
    expect(order).toHaveTextContent('Order')
    expect(order).toHaveTextContent('222222…2222')
  })

  test('renders the component without market ID', () => {
    const transaction = {
      stopOrdersCancellation: {
        marketId: null,
        stopOrderId: '2'.repeat(64)
      }
    }

    render(<StopOrderCancellation transaction={transaction} />)

    const rows = screen.getAllByTestId(tableLocators.dataRow)
    expect(rows).toHaveLength(1)
    const [order] = rows
    expect(order).toHaveTextContent('Order')
    expect(order).toHaveTextContent('222222…2222')
  })

  test('renders the component without stop order ID', () => {
    const transaction = {
      stopOrdersCancellation: {
        marketId: '1'.repeat(64),
        stopOrderId: null
      }
    }
    render(<StopOrderCancellation transaction={transaction} />)

    const rows = screen.getAllByTestId(tableLocators.dataRow)
    expect(rows).toHaveLength(1)
    const [order] = rows
    expect(order).toHaveTextContent('Market')
    expect(order).toHaveTextContent('111111…1111')
  })
})
