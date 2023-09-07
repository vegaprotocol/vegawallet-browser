import { fireEvent, render, screen } from '@testing-library/react'
import { AmountWithTooltip, locators } from './amount-with-tooltip'
import config from '!/config'
import { locators as decimalTooltipLocators } from './decimal-tooltip'

describe('AmountWithTooltip', () => {
  test('renders the amount and asset link', () => {
    // 1114-RCPT-007 I can see the amount of the asset being transferred
    // 1114-RCPT-008 I can see a link to the block explorer for that asset
    const assetId = 'your-asset-id'
    const amount = '100'
    render(<AmountWithTooltip assetId={assetId} amount={amount} />)
    const amountElement = screen.getByTestId(locators.amount)
    expect(amountElement).toBeInTheDocument()
    expect(amountElement).toHaveTextContent(amount)

    const assetExplorerLink = screen.getByTestId(locators.assetExplorerLink)
    expect(assetExplorerLink).toBeInTheDocument()
    expect(assetExplorerLink).toHaveAttribute('href', `${config.network.explorer}/assets/${assetId}`)
    expect(assetExplorerLink).toHaveTextContent('your-a…t-id')
  })

  test('renders the tooltip asset explorer link and docs links', async () => {
    const assetId = 'your-asset-id'
    const amount = '100'
    render(<AmountWithTooltip assetId={assetId} amount={amount} />)
    fireEvent.pointerMove(screen.getByTestId(locators.amount))
    await screen.findAllByTestId(decimalTooltipLocators.decimalTooltip)
  })
})
