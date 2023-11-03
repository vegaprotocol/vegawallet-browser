import { render, screen } from '@testing-library/react'
import { CancellationView } from './cancellation-view'
import { mockStore } from '../../../../test-helpers/mock-store'
import { useMarketsStore } from '../../../../stores/markets-store'

jest.mock('../../../../stores/markets-store')

jest.mock('../../utils/order-table', () => ({
  OrderTable: () => <div data-testid="order-table"></div>
}))
jest.mock('../../utils/order/badges', () => ({
  OrderBadges: () => <div data-testid="order-badges"></div>
}))

describe('CancellationView', () => {
  it('renders OrderTable with the order and market ids', () => {
    mockStore(useMarketsStore, {
      getMarketById: () => ({
        id: '1',
        tradableInstrument: {
          instrument: {
            code: 'BTC/USD'
          }
        }
      })
    })
    render(<CancellationView cancellation={{ orderId: '123', marketId: 'abc' }} />)
    expect(screen.getByTestId('order-table')).toBeInTheDocument()
    expect(screen.getByTestId('order-badges')).toBeInTheDocument()
  })
})
