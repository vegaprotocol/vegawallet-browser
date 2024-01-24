import { render, screen } from '@testing-library/react'

import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'

import { locators as tableLocators } from '../../../data-table'
import { StopOrderCancellation } from './cancellation'

const renderComponent = ({ transaction }: { transaction: any }) =>
  render(
    <MockNetworkProvider>
      <StopOrderCancellation transaction={transaction} />
    </MockNetworkProvider>
  )

describe('StopOrderCancellation', () => {
  it('renders the component with market ID and stop order ID', () => {
    // 1120-STPC-001 If present I can see the if of the market the order is being cancelled for
    // 1120-STPC-002 If present I can see the id of the stop order being cancelled
    const transaction = {
      stopOrdersCancellation: {
        marketId: '1'.repeat(64),
        stopOrderId: '2'.repeat(64)
      }
    }

    renderComponent({
      transaction
    })
    const [market, order] = screen.getAllByTestId(tableLocators.dataRow)
    expect(market).toHaveTextContent('Market')
    expect(market).toHaveTextContent('111111…1111')
    expect(order).toHaveTextContent('Order')
    expect(order).toHaveTextContent('222222…2222')
  })

  it('renders the component without market ID', () => {
    const transaction = {
      stopOrdersCancellation: {
        marketId: null,
        stopOrderId: '2'.repeat(64)
      }
    }

    renderComponent({
      transaction
    })

    const rows = screen.getAllByTestId(tableLocators.dataRow)
    expect(rows).toHaveLength(1)
    const [order] = rows
    expect(order).toHaveTextContent('Order')
    expect(order).toHaveTextContent('222222…2222')
  })

  it('renders the component without stop order ID', () => {
    const transaction = {
      stopOrdersCancellation: {
        marketId: '1'.repeat(64),
        stopOrderId: null
      }
    }
    renderComponent({
      transaction
    })

    const rows = screen.getAllByTestId(tableLocators.dataRow)
    expect(rows).toHaveLength(1)
    const [order] = rows
    expect(order).toHaveTextContent('Market')
    expect(order).toHaveTextContent('111111…1111')
  })
})
