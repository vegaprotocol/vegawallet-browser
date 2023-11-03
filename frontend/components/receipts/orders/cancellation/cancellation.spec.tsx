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

const mockGetOrderById = jest.fn(() =>
  Promise.resolve({
    id: '123',
    marketId: 'abc'
  })
)

const mockLastUpdatedTimestamp = 100000000

jest.mock('../../../../stores/orders-store')

const renderComponent = (mockTransaction: { orderCancellation: { orderId: string; marketId: string } }) => {
  mockStore(useOrdersStore, {
    getOrderById: mockGetOrderById,
    lastUpdated: mockLastUpdatedTimestamp
  })
  render(<Cancellation transaction={mockTransaction} />)
}

describe('Cancellation', () => {
  const mockTransaction = {
    orderCancellation: { orderId: '123', marketId: 'abc' }
  }

  it('calls getOrderById when orderId is provided', async () => {
    renderComponent(mockTransaction)
    await waitFor(() => expect(mockGetOrderById).toHaveBeenCalledWith('123', expect.anything()))
  })

  it('renders CancellationView with correct props', async () => {
    renderComponent(mockTransaction)
    await waitFor(() => {
      const cancellationViewElement = screen.getByTestId(locators.cancellationView)

      expect(cancellationViewElement).toBeInTheDocument()
    })
  })

  it('renders last updated field', async () => {
    // 1117-ORDC-003 I can see the time of when the order was fetched from the data node
    renderComponent(mockTransaction)

    await screen.findByText(`Last Updated: ${new Date(mockLastUpdatedTimestamp).toLocaleString()}`)
  })
})
