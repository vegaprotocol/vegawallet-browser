import { render, screen, waitFor } from '@testing-library/react'
import { Cancellation, orderSelector } from './cancellation'
import { locators } from './index'
import { OrdersStore } from '../../../../stores/orders-store'

jest.mock('../../../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({
    request: jest.fn()
  })
}))

const mockGetOrderById = jest.fn(() =>
  Promise.resolve({
    id: '123',
    marketId: 'abc'
  })
)

const mockLastUpdatedTimestamp = 100000000

jest.mock('../../../../stores/orders-store', () => ({
  ...jest.requireActual('../../../../stores/orders-store'),
  useOrdersStore: jest.fn(() => {
    return {
      getOrderById: mockGetOrderById,
      lastUpdated: mockLastUpdatedTimestamp
    }
  })
}))

describe('<Cancellation />', () => {
  const mockTransaction = {
    orderCancellation: { orderId: '123', marketId: 'abc' }
  }

  it('calls getOrderById when orderId is provided', async () => {
    render(<Cancellation transaction={mockTransaction} />)
    await waitFor(() => expect(mockGetOrderById).toHaveBeenCalledWith('123', expect.anything()))
  })

  it('renders CancellationView with correct props', async () => {
    render(<Cancellation transaction={mockTransaction} />)
    await waitFor(() => {
      const cancellationViewElement = screen.getByTestId(locators.cancellationView)
      expect(cancellationViewElement).toBeInTheDocument()
    })
  })

  it('renders last updated field', async () => {
    render(<Cancellation transaction={mockTransaction} />)
    await screen.findByText(`Last Updated: ${new Date(mockLastUpdatedTimestamp).toLocaleString()}`)
  })
})

describe('orderSelector', () => {
  it('should return getOrderById and lastUpdated from the state', () => {
    const mockState: OrdersStore = {
      loading: false,
      error: null,
      lastUpdated: 12345,
      getOrderById: jest.fn()
    }

    const result = orderSelector(mockState)

    expect(result).toEqual({
      getOrderById: mockState.getOrderById,
      lastUpdated: mockState.lastUpdated
    })
  })
})
