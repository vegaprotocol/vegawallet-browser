import { render, screen } from '@testing-library/react'
import { CancellationNotification, CancellationView, locators } from '.'

describe('<CancellationView />', () => {
  it('renders OrderTable with the order and market ids', async () => {
    render(<CancellationView cancellation={{ orderId: '123', marketId: 'abc' }} />)
    await screen.findByText('123')
    await screen.findByText('abc')
  })
})

describe('CancellationNotification', () => {
  it('should display "Cancel all open orders in this market" when marketId is provided and orderId is not', () => {
    render(<CancellationNotification orderId="" marketId="some-market-id" />)
    expect(screen.getByText('Cancel all open orders in this market')).toBeInTheDocument()
  })

  it('should display "Cancel all open orders in all markets" when neither orderId nor marketId is provided', () => {
    render(<CancellationNotification orderId="" marketId="" />)
    expect(screen.getByText('Cancel all open orders in all markets')).toBeInTheDocument()
  })

  it('should not render any Notification when orderId is provided', () => {
    render(<CancellationNotification orderId="some-order-id" marketId="" />)
    const notification = screen.queryByTestId(locators.cancellationNotification)
    expect(notification).not.toBeInTheDocument()
  })

  it('should not render any Notification when both orderId and marketId are provided', () => {
    render(<CancellationNotification orderId="some-order-id" marketId="some-market-id" />)
    const notification = screen.queryByTestId(locators.cancellationNotification)
    expect(notification).not.toBeInTheDocument()
  })
})
