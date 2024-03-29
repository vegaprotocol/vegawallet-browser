import { render, screen, waitFor } from '@testing-library/react'
import { formatDateWithLocalTimezone } from '@vegaprotocol/utils'

import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'
import { nanoSecondsToMilliseconds } from '@/lib/utils'
import { useMarketsStore } from '@/stores/markets-store'
import { OrdersStore, useOrdersStore } from '@/stores/orders-store'
import { DeepPartial, mockStore } from '@/test-helpers/mock-store'
import { silenceErrors } from '@/test-helpers/silence-errors'

import { testingNetwork } from '../../../../../config/well-known-networks'
import { locators as dataTableLocators } from '../../../data-table'
import { Cancellation } from './cancellation'
import { locators } from './cancellation-view'

jest.mock('@/contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({
    request: jest.fn()
  })
}))

const mockGetOrderById = jest.fn()

const mockLastUpdatedTimestamp = 100_000_000

jest.mock('@/stores/orders-store')
jest.mock('@/stores/markets-store')

const mockTransaction = {
  orderCancellation: { orderId: '123', marketId: 'abc' }
}

const defaultStoreData = {
  getOrderById: mockGetOrderById,
  lastUpdated: mockLastUpdatedTimestamp,
  order: { id: '123', marketId: 'abc', createdAt: '1000000000000' }
}

const renderComponent = (storeData: DeepPartial<OrdersStore> = defaultStoreData) => {
  mockStore(useOrdersStore, storeData)
  mockStore(useMarketsStore, {
    getMarketById: () => ({})
  })
  render(
    <MockNetworkProvider>
      <Cancellation transaction={mockTransaction} />
    </MockNetworkProvider>
  )
}

describe('Cancellation', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(100_000_000)
  })
  afterEach(() => {
    jest.useRealTimers()
  })
  it('calls getOrderById when orderId is provided', async () => {
    renderComponent()
    await waitFor(() => expect(mockGetOrderById).toHaveBeenCalledWith(expect.anything(), '123', testingNetwork.id))
  })

  it('renders CancellationView', async () => {
    renderComponent()
    const cancellationViewElement = screen.getByTestId(locators.cancellationView)
    expect(cancellationViewElement).toBeInTheDocument()
  })

  it('renders last updated field', async () => {
    // 1117-ORDC-003 I can see the time of when the order was fetched from the data node
    renderComponent()

    await screen.findByText(
      `Last Updated: ${formatDateWithLocalTimezone(new Date(nanoSecondsToMilliseconds(mockLastUpdatedTimestamp)))}`
    )
  })

  it('renders additional API fields in order table if present', async () => {
    // 1130-ODTB-019 If order cancellation then the data is enriched with [basic order data](#basic-order-data) from the API
    renderComponent()

    const createdAt = screen.getAllByTestId(dataTableLocators.dataRow)[3]
    // Created at field is only present from API
    expect(createdAt).toHaveTextContent('Created at')
    expect(createdAt).toHaveTextContent('01 January 1970 00:16 (UTC)')
  })

  it('errors if the order cannot be found', async () => {
    silenceErrors()
    expect(() =>
      renderComponent({
        getOrderById: mockGetOrderById,
        lastUpdated: mockLastUpdatedTimestamp,
        order: null
      })
    ).toThrow('Order not found')
  })
})
