import { render, screen } from '@testing-library/react'
import { StopOrderSubmission, locators } from './submission'
import { locators as tableLocators } from '../../../data-table/data-table'

jest.mock('../../utils/order-table', () => ({
  OrderTable: () => <div data-testid="order-table" />
}))
jest.mock('../../utils/order/badges', () => ({
  OrderBadges: () => <div data-testid="order-badges" />
}))

describe('StopOrderSubmission', () => {
  test('renders the component with "Rises above" details', () => {
    // 1114-RCPT-025 If a rises above order is present I see the rises above section
    // 1114-RCPT-027 In each section I can see the trigger price
    // 1114-RCPT-028 In each section I can see the all the details of the order
    const transaction = {
      stopOrdersSubmission: {
        risesAbove: {
          expiryStrategy: 'EXPIRY_STRATEGY_SUBMIT',
          price: 100,
          expiresAt: 1638534000000,
          trailingPercentOffset: 5,
          orderSubmission: {
            marketId: 'market1'
          }
        },
        fallsBelow: null
      }
    }

    render(<StopOrderSubmission transaction={transaction} />)
    const [triggerPrice, trailingPercentOffset, expiryStrategy, expiresAt] = screen.getAllByTestId(
      tableLocators.dataRow
    )
    expect(screen.getByTestId(locators.sectionHeader)).toHaveTextContent('Rises above ↗')
    expect(triggerPrice).toHaveTextContent('Trigger price')
    expect(triggerPrice).toHaveTextContent('100')
    expect(trailingPercentOffset).toHaveTextContent('Trailing offset')
    expect(trailingPercentOffset).toHaveTextContent('5%')
    expect(expiryStrategy).toHaveTextContent('Expiry strategy')
    expect(expiryStrategy).toHaveTextContent('Submit')
    expect(expiresAt).toHaveTextContent('Expires at')
    expect(expiresAt).toHaveTextContent('1/1/1970, 12:27:18 AM')
    expect(screen.getByTestId(locators.orderDetails)).toHaveTextContent('Order details')
    expect(screen.getByTestId('order-table')).toBeTruthy()
    expect(screen.getByTestId('order-badges')).toBeTruthy()
  })

  test('renders the component with "Falls below" details', () => {
    // 1114-RCPT-026 If a falls below is present I see the falls below section
    // 1114-RCPT-027 In each section I can see the trigger price
    // 1114-RCPT-028 In each section I can see the all the details of the order
    const transaction = {
      stopOrdersSubmission: {
        risesAbove: null,
        fallsBelow: {
          expiryStrategy: 'EXPIRY_STRATEGY_SUBMIT',
          price: 100,
          expiresAt: 1638534000000,
          trailingPercentOffset: 5,
          orderSubmission: {
            marketId: 'market2'
          }
        }
      }
    }

    render(<StopOrderSubmission transaction={transaction} />)

    const [triggerPrice, trailingPercentOffset, expiryStrategy, expiresAt] = screen.getAllByTestId(
      tableLocators.dataRow
    )

    expect(screen.getByTestId(locators.sectionHeader)).toHaveTextContent('Falls below ↘')
    expect(triggerPrice).toHaveTextContent('Trigger price')
    expect(triggerPrice).toHaveTextContent('100')
    expect(trailingPercentOffset).toHaveTextContent('Trailing offset')
    expect(trailingPercentOffset).toHaveTextContent('5%')
    expect(expiryStrategy).toHaveTextContent('Expiry strategy')
    expect(expiryStrategy).toHaveTextContent('Submit')
    expect(expiresAt).toHaveTextContent('Expires at')
    expect(expiresAt).toHaveTextContent('1/1/1970, 12:27:18 AM')
    expect(screen.getByTestId(locators.orderDetails)).toHaveTextContent('Order details')
    expect(screen.getByTestId('order-table')).toBeTruthy()
    expect(screen.getByTestId('order-badges')).toBeTruthy()
  })

  test('does not render falls below or rises above if not present', () => {
    const transaction = {
      stopOrdersSubmission: {}
    }
    render(<StopOrderSubmission transaction={transaction} />)
    expect(screen.queryByTestId(locators.sectionHeader)).not.toBeInTheDocument()
  })
})
