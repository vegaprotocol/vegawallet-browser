import { render, screen, waitFor } from '@testing-library/react'
import { CancellationNotification, CancellationView, Cancellation, selectGetOrderById, locators } from '.'
import { OrdersStore } from '../../../../stores/orders-store.ts'

jest.mock('../../../../contexts/json-rpc/json-rpc-context.ts', () => ({
  useJsonRpcClient: () => ({
    request: jest.fn()
  })
}))

const mockGetOrderById = jest.fn(() => Promise.resolve({ order: {}, lastUpdated: Date.now() }))

jest.mock('../../../../stores/orders-store', () => ({
  ...jest.requireActual('../../../../stores/orders-store'),
  useOrdersStore: jest.fn(() => {
    return {
      getOrderById: mockGetOrderById
    }
  })
}))

describe('<CancellationView />', () => {
  it('calls getOrderById when orderId is provided', async () => {
    render(<CancellationView cancellation={{ orderId: '123', marketId: 'abc' }} />)
    await waitFor(() => expect(mockGetOrderById).toHaveBeenCalledWith('123', expect.anything()))
  })

  it('renders OrderTable with the order and market ids', async () => {
    render(<CancellationView cancellation={{ orderId: '123', marketId: 'abc' }} />)
    await screen.findByText('123')
    await screen.findByText('abc')
  })

  it('renders last updated field with the fetched lastUpdated value', async () => {
    const lastUpdatedTimestamp = Date.now()
    mockGetOrderById.mockResolvedValueOnce({ order: {}, lastUpdated: lastUpdatedTimestamp })
    render(<CancellationView cancellation={{ orderId: '123', marketId: 'abc' }} />)
    await screen.findByText(`Last Updated: ${new Date(lastUpdatedTimestamp).toLocaleString()}`)
  })

  it('logs an error if getOrderById fails', async () => {
    mockGetOrderById.mockRejectedValueOnce(new Error('Some error occurred'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    render(<CancellationView cancellation={{ orderId: '123', marketId: 'abc' }} />)
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch order details:', expect.any(Error)))
    // Restore console.error to its original state
    consoleSpy.mockRestore()
  })
})

describe('selectGetOrderById function', () => {
  it('returns an object with getOrderById from state', () => {
    const state: OrdersStore = {
      loading: false,
      getOrderById: jest.fn().mockResolvedValue({ order: {}, lastUpdated: Date.now() })
    }
    const result = selectGetOrderById(state)
    expect(result).toEqual({ getOrderById: state.getOrderById })
  })
})

describe('CancellationNotification', () => {
  it('should display "Cancel all open orders in this market" when marketId is provided and orderId is not', () => {
    render(<CancellationNotification orderId="" marketId="some-market-id" />)
    expect(screen.getByText('Cancel all open orders in this market')).toBeInTheDocument()
  })

  it('should display "Cancel all open orders in all markets" when neither orderId nor marketId is provided', () => {
    render(<CancellationNotification orderId="" marketId="" />)
    expect(screen.getByText('Cancel all open orders in all markets')).toBeInTheDocument()
  })

  it('should not render any Notification when orderId is provided', () => {
    render(<CancellationNotification orderId="some-order-id" marketId="" />)
    const notification = screen.queryByTestId(locators.cancellationNotification)
    expect(notification).not.toBeInTheDocument()
  })

  it('should not render any Notification when both orderId and marketId are provided', () => {
    render(<CancellationNotification orderId="some-order-id" marketId="some-market-id" />)
    const notification = screen.queryByTestId(locators.cancellationNotification)
    expect(notification).not.toBeInTheDocument()
  })
})

describe('<Cancellation />', () => {
  it('renders CancellationView with correct props', async () => {
    const mockTransaction = {
      orderCancellation: { orderId: '123', marketId: 'abc' }
    }

    render(<Cancellation transaction={mockTransaction} />)
    await waitFor(() => {
      const cancellationViewElement = screen.getByTestId(locators.cancellationView)
      expect(cancellationViewElement).toBeInTheDocument()
    })
  })
})
