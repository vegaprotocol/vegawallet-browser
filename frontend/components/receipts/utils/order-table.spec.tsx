import { render, screen } from '@testing-library/react'
import { OrderTable } from './order-table'
import { locators } from '../../data-table/data-table'
import { OrderType, Side } from '@vegaprotocol/types'

describe('OrderTable', () => {
  it('renders a row for each property', () => {
    // 1114-RCPT-012 I can see the market id of the order I am submitting
    // 1114-RCPT-013 I can see the direction of order I am submitting
    // 1114-RCPT-014 I can see the type of the order I am submitting
    // 1114-RCPT-015 I can see the reference of the order I am submitting
    // 1114-RCPT-016 I can see any relevant order badges
    // 1114-RCPT-017 I can see the price of the order
    // 1114-RCPT-018 I can see the size of the order
    // 1114-RCPT-019 If present I can see the market id relating to the order
    // 1114-RCPT-020 If present I can see the order id relating to the order
    // 1114-RCPT-021 I can see the order id of the order I am amending
    // 1114-RCPT-022 I can see the market id relating to the order I am amending
    render(
      <OrderTable
        direction={Side.SIDE_BUY}
        marketId={'1'.repeat(64)}
        orderId={'2'.repeat(64)}
        size={'12'}
        price={'123'}
        reference="ref"
        type={OrderType.TYPE_MARKET}
      />
    )
    const [priceRow, sizeRow, marketRow, orderRow, directionRow, typeRow, referenceRow] = screen.getAllByTestId(
      locators.dataRow
    )
    expect(priceRow).toHaveTextContent('Price')
    expect(priceRow).toHaveTextContent('123')

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
    expect(screen.getAllByTestId(locators.dataRow)).toHaveLength(7)
  })

  it('does not render row if the property is undefined', () => {
    render(<OrderTable />)
    expect(screen.queryAllByTestId(locators.dataRow)).toHaveLength(0)
  })
  it('renders short for buy orders', () => {
    render(<OrderTable direction={Side.SIDE_BUY} />)
    const [directionRow] = screen.getAllByTestId(locators.dataRow)
    expect(directionRow).toHaveTextContent('Direction')
    expect(directionRow).toHaveTextContent('Long')
  })
  it('renders long for sell orders', () => {
    render(<OrderTable direction={Side.SIDE_SELL} />)
    const [directionRow] = screen.getAllByTestId(locators.dataRow)
    expect(directionRow).toHaveTextContent('Direction')
    expect(directionRow).toHaveTextContent('Short')
  })
})
