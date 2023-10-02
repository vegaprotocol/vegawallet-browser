import { render, screen } from '@testing-library/react'
import { OrderTable } from './order-table'
import { locators } from '../../data-table/data-table'
import { vegaOrderType, vegaPeggedReference, vegaSide } from '@vegaprotocol/rest-clients/dist/trading-data'

describe('OrderTable', () => {
  it('renders a row for each property', () => {
    // 1118-ORDS-001 I can see the market id of the order I am submitting
    // 1118-ORDS-002 I can see the direction of order I am submitting
    // 1118-ORDS-003 I can see the type of the order I am submitting
    // 1118-ORDS-004 I can see the reference of the order I am submitting
    // 1118-ORDS-006 I can see the price of the order
    // 1118-ORDS-007 I can see the size of the order
    // 1118-ORDS-008 I can see the raw offset price of the order
    // 1118-ORDS-009 I can see the reference price of the order
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
        type={vegaOrderType.TYPE_MARKET}
        peggedOrder={{
          reference: vegaPeggedReference.PEGGED_REFERENCE_BEST_BID,
          offset: '6'
        }}
      />
    )
    const [priceRow, peggedInfoRow, sizeRow, marketRow, orderRow, directionRow, typeRow, referenceRow] =
      screen.getAllByTestId(locators.dataRow)
    expect(priceRow).toHaveTextContent('Price')
    expect(priceRow).toHaveTextContent('123')

    expect(peggedInfoRow).toHaveTextContent('6')
    expect(peggedInfoRow).toHaveTextContent('from best bid')

    expect(sizeRow).toHaveTextContent('Size')
    expect(sizeRow).toHaveTextContent('12')

    expect(marketRow).toHaveTextContent('Market')
    expect(marketRow).toHaveTextContent('111111…1111')

    expect(orderRow).toHaveTextContent('Order')
    expect(orderRow).toHaveTextContent('222222…2222')

    expect(directionRow).toHaveTextContent('Direction')
    expect(directionRow).toHaveTextContent('Long')

    expect(typeRow).toHaveTextContent('Type')
    expect(typeRow).toHaveTextContent('Market')

    expect(referenceRow).toHaveTextContent('Reference')
    expect(referenceRow).toHaveTextContent('ref')
    expect(screen.getAllByTestId(locators.dataRow)).toHaveLength(8)
  })

  it('does not render row if the property is undefined', () => {
    render(<OrderTable />)
    expect(screen.queryAllByTestId(locators.dataRow)).toHaveLength(0)
  })
  it('renders short for buy orders', () => {
    render(<OrderTable direction={vegaSide.SIDE_BUY} />)
    const [directionRow] = screen.getAllByTestId(locators.dataRow)
    expect(directionRow).toHaveTextContent('Direction')
    expect(directionRow).toHaveTextContent('Long')
  })
  it('renders long for sell orders', () => {
    render(<OrderTable direction={vegaSide.SIDE_SELL} />)
    const [directionRow] = screen.getAllByTestId(locators.dataRow)
    expect(directionRow).toHaveTextContent('Direction')
    expect(directionRow).toHaveTextContent('Short')
  })
})
