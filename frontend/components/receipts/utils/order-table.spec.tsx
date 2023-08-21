import { render, screen } from '@testing-library/react'
import { OrderTable } from './order-table'
import { locators } from '../../data-table/data-table'
import { Side } from '@vegaprotocol/types'

describe('OrderTable', () => {
  it('renders a row for each property', () => {
    render(
      <OrderTable
        direction={Side.SIDE_BUY}
        marketId={'1'.repeat(64)}
        orderId={'2'.repeat(64)}
        size={'12'}
        price={'123'}
      />
    )
  })

  it('does not render row if the property is undefined', () => {
    render(<OrderTable />)
    expect(screen.queryAllByTestId(locators.dataRow)).toHaveLength(0)
  })
})
