import { render, screen } from '@testing-library/react'
import { CancellationNotification } from '.'

jest.mock('../../../../stores/orders-store', () => ({
  useWalletStore: () => jest.fn()
}))

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
    const { container } = render(<CancellationNotification orderId="some-order-id" marketId="" />)
    expect(container.firstChild).toBeNull()
  })

  it('should not render any Notification when both orderId and marketId are provided', () => {
    const { container } = render(<CancellationNotification orderId="some-order-id" marketId="some-market-id" />)
    expect(container.firstChild).toBeNull()
  })
})
