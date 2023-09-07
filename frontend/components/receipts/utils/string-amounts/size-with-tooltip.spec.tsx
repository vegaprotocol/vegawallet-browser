import { fireEvent, render, screen } from '@testing-library/react'
import { locators as decimalTooltipLocators } from './decimal-tooltip'
import { SizeWithTooltip, locators } from './size-with-tooltip'

describe('SizeWithTooltip', () => {
  test('renders the amount', () => {
    const marketId = 'your-market-id'
    const amount = '100'
    render(<SizeWithTooltip marketId={marketId} size={amount} />)
    const amountElement = screen.getByTestId(locators.size)
    expect(amountElement).toBeInTheDocument()
    expect(amountElement).toHaveTextContent(amount)
  })

  test('renders the tooltip asset explorer link and docs links', async () => {
    const marketId = 'your-market-id'
    const amount = '100'
    render(<SizeWithTooltip marketId={marketId} size={amount} />)
    fireEvent.pointerMove(screen.getByTestId(locators.size))
    await screen.findAllByTestId(decimalTooltipLocators.decimalTooltip)
  })
})
