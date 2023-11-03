import { render, screen, waitFor } from '@testing-library/react'
import { Cancellation } from './cancellation'
import { locators } from './cancellation-view'
import { useOrdersStore } from '../../../../stores/orders-store'
import { mockStore } from '../../../../test-helpers/mock-store'

jest.mock('../../../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({
    request: jest.fn()
  })
}))

const mockGetOrderById = jest.fn()

const mockLastUpdatedTimestamp = 100000000

jest.mock('../../../../stores/orders-store')

const mockTransaction = {
  orderCancellation: { orderId: '123', marketId: 'abc' }
}

const renderComponent = () => {
  mockStore(useOrdersStore, {
    getOrderById: mockGetOrderById,
    lastUpdated: mockLastUpdatedTimestamp,
    order: { id: '123', marketId: 'abc' }
  })
  render(<Cancellation transaction={mockTransaction} />)
}

describe('Cancellation', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(100000000)
  })
  afterEach(() => {
    jest.useRealTimers()
  })
  it('calls getOrderById when orderId is provided', async () => {
    renderComponent()
    await waitFor(() => expect(mockGetOrderById).toHaveBeenCalledWith('123', expect.anything()))
  })

  it('renders CancellationView with correct props', async () => {
    renderComponent()
    await waitFor(() => {
      const cancellationViewElement = screen.getByTestId(locators.cancellationView)

      expect(cancellationViewElement).toBeInTheDocument()
    })
  })

  it('renders last updated field', async () => {
    // 1117-ORDC-003 I can see the time of when the order was fetched from the data node
    renderComponent()

    await screen.findByText(`Last Updated: ${new Date(mockLastUpdatedTimestamp).toLocaleString()}`)
  })
})
