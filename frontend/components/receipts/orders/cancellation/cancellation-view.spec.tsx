import { render, screen } from '@testing-library/react'
import { CancellationNotification, CancellationView, locators } from './cancellation-view'
import { mockStore } from '../../../../test-helpers/mock-store'
import { useMarketsStore } from '../../../../stores/markets-store'

jest.mock('../../../../stores/markets-store')

describe('<CancellationView />', () => {
  it('renders OrderTable with the order and market ids', async () => {
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
    await screen.findByText('123')
    await screen.findByText('BTC/USD')
  })
})

describe('CancellationNotification', () => {
  it('should display "Cancel all open orders in this market" when marketId is provided and orderId is not', () => {
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
    render(<CancellationNotification orderId="" marketId="some-market-id" />)
    expect(screen.getByText('Cancel ALL open orders in BTC/USD')).toBeInTheDocument()
  })

  it('should display "Cancel all open orders in all markets" when neither orderId nor marketId is provided', () => {
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
    render(<CancellationNotification orderId="" marketId="" />)
    expect(screen.getByText('Cancel ALL orders in ALL markets')).toBeInTheDocument()
  })

  it('should not render any Notification when orderId is provided', () => {
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
    render(<CancellationNotification orderId="some-order-id" marketId="" />)
    const notification = screen.queryByTestId(locators.cancellationNotification)
    expect(notification).not.toBeInTheDocument()
  })

  it('should not render any Notification when both orderId and marketId are provided', () => {
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
    render(<CancellationNotification orderId="some-order-id" marketId="some-market-id" />)
    const notification = screen.queryByTestId(locators.cancellationNotification)
    expect(notification).not.toBeInTheDocument()
  })

  it('should render market id if market code cannot be found', () => {
    mockStore(useMarketsStore, {
      getMarketById: () => ({
        id: '1'
      })
    })
    render(<CancellationNotification orderId="" marketId="some-market-id" />)

    expect(screen.getByText('Cancel ALL open orders in some-m…t-id')).toBeInTheDocument()
  })
})
