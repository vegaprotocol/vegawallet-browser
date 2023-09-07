import { fireEvent, render, screen } from '@testing-library/react'
import { locators as decimalTooltipLocators } from './decimal-tooltip'
import { PriceWithTooltip, locators } from './price-with-tooltip'

describe('PriceWithTooltip', () => {
  test('renders the amount', () => {
    const marketId = 'your-market-id'
    const amount = '100'
    render(<PriceWithTooltip marketId={marketId} price={amount} />)
    const amountElement = screen.getByTestId(locators.price)
    expect(amountElement).toBeInTheDocument()
    expect(amountElement).toHaveTextContent(amount)
  })

  test('renders the tooltip asset explorer link and docs links', async () => {
    const marketId = 'your-market-id'
    const amount = '100'
    render(<PriceWithTooltip marketId={marketId} price={amount} />)
    fireEvent.pointerMove(screen.getByTestId(locators.price))
    await screen.findAllByTestId(decimalTooltipLocators.decimalTooltip)
  })
})
