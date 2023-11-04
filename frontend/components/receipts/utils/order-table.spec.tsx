import { render, screen } from '@testing-library/react'
import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { OrderTable } from './order-table'
import { locators as dataTableLocators } from '../../data-table/data-table'
import { locators as orderMarketLocators } from './order/order-market'
import { locators as orderPriceLocators } from './order/order-price'
import { locators as amountWithSymbolLocators } from './string-amounts/amount-with-symbol'
import { locators as priceWithTooltipLocators } from './string-amounts/price-with-tooltip'
import { useMarketsStore } from '../../../stores/markets-store'
import { useAssetsStore } from '../../../stores/assets-store'
import { generateMarket } from '../../../test-helpers/generate-market'
import { generateAsset } from '../../../test-helpers/generate-asset'
import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { vegaOrderType, vegaPeggedReference, vegaSide } from '@vegaprotocol/rest-clients/dist/trading-data'
import { mockStore } from '../../../test-helpers/mock-store'
import { vegaOrderStatus } from '@vegaprotocol/rest-clients/dist/core'

jest.mock('../../../stores/markets-store', () => ({
  ...jest.requireActual('../../../stores/markets-store'),
  useMarketsStore: jest.fn(() => {
    return {
      loading: false,
      markets: [],
      getMarketById: jest.fn()
    }
  })
}))
jest.mock('../../../stores/assets-store')

// refactor store mocks to use new mocking component when available
describe('OrderTable', () => {
  const mockMarket = generateMarket()
  const mockAsset = generateAsset()

  beforeEach(() => {
    mockStore(useMarketsStore, {
      loading: false,
      markets: [],
      getMarketById: jest.fn()
    })
    mockStore(useAssetsStore, {
      loading: false,
      assets: [],
      getAssetById: jest.fn()
    })
  })

  it('renders a row for each property', () => {
    // 1130-ODTB-001 I can see the market id of the order I am submitting
    // 1130-ODTB-002 I can see the direction of order I am submitting
    // 1130-ODTB-003 I can see the type of the order I am submitting
    // 1130-ODTB-004 I can see the reference of the order I am submitting
    // 1130-ODTB-005 I can see any relevant [order badges](./1119-ORBD-order_badges.md)
    // 1130-ODTB-006 I can see the [price of the order with tooltip](./1127-DECM-decimal_numbers.md)
    // 1130-ODTB-007 I can see the [size of the order with tooltip](./1127-DECM-decimal_numbers.md)
    // 1130-ODTB-008 I can see the raw offset price of the order
    // 1130-ODTB-009 I can see the reference price of the order

    // 1117-ORDC-001 If present I can see the market id relating to the order
    // 1117-ORDC-002 If present I can see the order id relating to the order

    // 1116-ORDA-001 I can see the order id of the order I am amending
    // 1116-ORDA-002 I can see the market id relating to the order I am amending

    render(
      <OrderTable
        direction={vegaSide.SIDE_BUY}
        marketId={'1'.repeat(64)}
        orderId={'2'.repeat(64)}
        size={'12'}
        price={'123'}
        reference="ref"
        type={vegaOrderType.TYPE_LIMIT}
        peggedOrder={{
          reference: vegaPeggedReference.PEGGED_REFERENCE_BEST_BID,
          offset: '6'
        }}
      />
    )
    const [priceRow, peggedInfoRow, sizeRow, marketRow, orderRow, directionRow, typeRow, referenceRow] =
      screen.getAllByTestId(dataTableLocators.dataRow)
    expect(priceRow).toHaveTextContent('Price')
    expect(priceRow).toHaveTextContent('123')

    expect(peggedInfoRow).toHaveTextContent('6')
    expect(peggedInfoRow).toHaveTextContent('from best bid')

    expect(sizeRow).toHaveTextContent('Size')
    expect(sizeRow).toHaveTextContent('12')

    expect(marketRow).toHaveTextContent('Market')
    expect(marketRow).toHaveTextContent(truncateMiddle('1'.repeat(64)))

    expect(orderRow).toHaveTextContent('Order')
    expect(orderRow).toHaveTextContent(truncateMiddle('2'.repeat(64)))

    expect(directionRow).toHaveTextContent('Direction')
    expect(directionRow).toHaveTextContent('Long')

    expect(typeRow).toHaveTextContent('Type')
    expect(typeRow).toHaveTextContent('Limit')

    expect(referenceRow).toHaveTextContent('Reference')
    expect(referenceRow).toHaveTextContent('ref')
    expect(screen.getAllByTestId(dataTableLocators.dataRow)).toHaveLength(8)
  })

  // TODO add status to ACs
  it('renders fields that are provided from the API', () => {
    // 1130-ODTB-014 If applicable I can see the time the order was created at
    // 1130-ODTB-015 If applicable I can see the time the order was updated at
    // 1130-ODTB-016 If applicable I can see the size of the order remaining
    // 1130-ODTB-017 If applicable I can see the version of the order
    // 1130-ODTB-018 If applicable I can see the status of the order
    render(
      <OrderTable
        marketId="123"
        createdAt={'1000000000000'}
        updatedAt={'1000000000000'}
        remaining={'100'}
        version={'1'}
        status={vegaOrderStatus.STATUS_ACTIVE}
      />
    )
    // Skip market row, as asserted above
    const [, createdAtRow, updatedAtRow, remainingRow, statusRow, versionRow] = screen.getAllByTestId(
      dataTableLocators.dataRow
    )

    expect(createdAtRow).toHaveTextContent('Created at')
    expect(createdAtRow).toHaveTextContent('01 January 1970 00:16 (UTC)')

    expect(updatedAtRow).toHaveTextContent('Updated at')
    expect(updatedAtRow).toHaveTextContent('01 January 1970 00:16 (UTC)')

    expect(remainingRow).toHaveTextContent('Remaining')
    expect(remainingRow).toHaveTextContent('100')

    expect(statusRow).toHaveTextContent('Status')
    expect(statusRow).toHaveTextContent('Active')

    expect(versionRow).toHaveTextContent('Version')
    expect(versionRow).toHaveTextContent('1')
  })

  it('does not render row if the property is undefined', () => {
    render(<OrderTable />)
    expect(screen.queryAllByTestId(dataTableLocators.dataRow)).toHaveLength(0)
  })
  it('renders short for buy orders', () => {
    render(<OrderTable direction={vegaSide.SIDE_BUY} />)
    const [directionRow] = screen.getAllByTestId(dataTableLocators.dataRow)
    expect(directionRow).toHaveTextContent('Direction')
    expect(directionRow).toHaveTextContent('Long')
  })
  it('renders long for sell orders', () => {
    render(<OrderTable direction={vegaSide.SIDE_SELL} />)
    const [directionRow] = screen.getAllByTestId(dataTableLocators.dataRow)
    expect(directionRow).toHaveTextContent('Direction')
    expect(directionRow).toHaveTextContent('Short')
  })

  // testing code branches dealing with enriched market data - ACs for this are in the component tests
  it('renders enriched market when marketId matches available markets', () => {
    mockStore(useMarketsStore, {
      loading: false,
      markets: [mockMarket],
      getMarketById: jest.fn().mockReturnValue(mockMarket)
    })

    render(<OrderTable marketId={mockMarket.id} />)
    expect(screen.getByTestId(orderMarketLocators.orderDetailsMarketCode)).toHaveTextContent(
      mockMarket.tradableInstrument?.instrument?.code as string
    )
  })

  it("doesn't render enriched market when marketId and markets are not provided", () => {
    render(<OrderTable />)
    expect(screen.queryByTestId(orderMarketLocators.orderDetailsMarketCode)).not.toBeInTheDocument()
  })

  it("doesn't render enriched market when marketId does not match available markets", () => {
    mockStore(useMarketsStore, {
      loading: false,
      markets: [mockMarket],
      getMarketById: jest.fn().mockReturnValue(null)
    })

    render(<OrderTable marketId="blah" />)
    expect(screen.queryByTestId(orderMarketLocators.orderDetailsMarketCode)).not.toBeInTheDocument()
  })

  // testing code branches dealing with enriched asset data - ACs for this are in the component tests
  it('renders enriched price info when market and nested properties exist', () => {
    const mockPrice = '123'
    const mockDecimals = Number(mockMarket.decimalPlaces as string)
    mockStore(useMarketsStore, {
      loading: false,
      markets: [mockMarket],
      getMarketById: jest.fn().mockReturnValue(mockMarket)
    })
    mockStore(useAssetsStore, {
      loading: false,
      assets: [mockAsset],
      getAssetById: jest.fn().mockReturnValue(mockAsset)
    })

    render(<OrderTable marketId="1" price={mockPrice} />)
    expect(screen.getByTestId(amountWithSymbolLocators.amount)).toHaveTextContent(
      formatNumber(toBigNum(mockPrice, mockDecimals), mockDecimals)
    )
  })

  it('does not render enriched price info when market or nested properties do not exist', () => {
    render(<OrderTable />)
    expect(screen.queryByTestId(amountWithSymbolLocators.amount)).not.toBeInTheDocument()
  })

  it('renders symbol when asset information exists', () => {
    mockStore(useAssetsStore, {
      loading: false,
      assets: [mockAsset],
      getAssetById: jest.fn().mockReturnValue(mockAsset)
    })
    mockStore(useMarketsStore, {
      loading: false,
      markets: [mockMarket],
      getMarketById: jest.fn().mockReturnValue(mockMarket)
    })

    render(<OrderTable marketId="1" price="123" />)
    expect(screen.getByTestId(amountWithSymbolLocators.symbol)).toHaveTextContent(mockAsset.details?.symbol as string)
  })

  it("doesn't render symbol when asset information doesn't exist", () => {
    render(<OrderTable marketId="1" price="123" />)
    expect(screen.queryByTestId(amountWithSymbolLocators.symbol)).not.toBeInTheDocument()
  })

  it('sets assetInfo to undefined when market exists but nested properties do not', () => {
    const incompleteMockMarket = generateMarket({
      tradableInstrument: {
        instrument: {
          future: undefined
        }
      }
    })
    mockStore(useMarketsStore, {
      loading: false,
      markets: [incompleteMockMarket],
      getMarketById: jest.fn().mockReturnValue(incompleteMockMarket)
    })
    mockStore(useAssetsStore, {
      loading: false,
      assets: [mockAsset],
      getAssetById: jest.fn().mockReturnValue(mockAsset)
    })

    render(<OrderTable marketId="1" />)
    expect(screen.queryByTestId(amountWithSymbolLocators.symbol)).not.toBeInTheDocument()
  })

  it('sets assetInfo to undefined when assets array is empty', () => {
    mockStore(useMarketsStore, {
      loading: false,
      markets: [mockMarket],
      getMarketById: jest.fn().mockReturnValue(mockMarket)
    })
    mockStore(useAssetsStore, {
      loading: false,
      assets: [],
      getAssetById: jest.fn().mockReturnValue(null)
    })

    render(<OrderTable marketId="1" />)
    expect(screen.queryByTestId(amountWithSymbolLocators.symbol)).not.toBeInTheDocument()
  })

  // testing code branches dealing with price field display behavior
  it('displays "market price" for market order types', () => {
    render(<OrderTable price="100" type={vegaOrderType.TYPE_MARKET} marketId="1" />)

    expect(screen.getByTestId(orderPriceLocators.orderDetailsMarketPrice)).toBeInTheDocument()
  })

  it('displays price for non-zero prices in non-market orders', () => {
    render(<OrderTable price="100" type={vegaOrderType.TYPE_LIMIT} marketId="1" />)

    expect(screen.getByTestId(priceWithTooltipLocators.priceWithTooltip)).toBeInTheDocument()
  })

  it('displays enriched size data when markets (and size) are provided', () => {
    const mockSize = '100'
    const mockPositionDecimals = Number(mockMarket.positionDecimalPlaces as string)

    mockStore(useMarketsStore, {
      loading: false,
      markets: [mockMarket],
      getMarketById: jest.fn().mockReturnValue(mockMarket)
    })
    mockStore(useAssetsStore, {
      loading: false,
      assets: [mockAsset],
      getAssetById: jest.fn().mockReturnValue(mockAsset)
    })

    render(<OrderTable marketId="1" size={mockSize} />)

    expect(screen.getByTestId(amountWithSymbolLocators.amount)).toHaveTextContent(
      formatNumber(toBigNum(mockSize, mockPositionDecimals), mockPositionDecimals)
    )
  })

  it('does not display enriched size when markets are not provided', () => {
    render(<OrderTable marketId="1" size="100" />)
    expect(screen.queryByTestId(amountWithSymbolLocators.amount)).not.toBeInTheDocument()
  })
})
