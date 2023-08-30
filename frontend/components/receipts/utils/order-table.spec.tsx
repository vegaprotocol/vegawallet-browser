import { render, screen } from '@testing-library/react'
import { OrderTable } from './order-table'
import { locators } from '../../data-table/data-table'
import { OrderType, Side } from '@vegaprotocol/types'

describe('OrderTable', () => {
  it('renders a row for each property', () => {
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
    const [marketRow, orderRow, directionRow, typeRow, referenceRow] = screen.getAllByTestId(locators.dataRow)
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
    expect(screen.getAllByTestId(locators.dataRow)).toHaveLength(5)
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
