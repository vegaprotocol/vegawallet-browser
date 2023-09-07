import { fireEvent, render, screen } from '@testing-library/react'
import { AmountWithTooltip, locators } from './amount-with-tooltip'
import config from '!/config'

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
    // 1114-RCPT-009 When I hover over the price I can see an explanation of how to calculate the human readable price from the raw price
    // 1114-RCPT-010 When I hover over the price I can see a link to the docs to read more about the price
    // 1114-RCPT-011 When I hover over the price I can click on a link to go to the block explorer to see the asset information
    const assetId = 'your-asset-id'
    const amount = '100'
    render(<AmountWithTooltip assetId={assetId} amount={amount} />)
    fireEvent.pointerMove(screen.getByTestId(locators.amount))
    await screen.findAllByTestId(locators.tooltipAssetExplorerLink)

    const [description1] = screen.getAllByTestId(locators.description1)
    expect(description1).toBeInTheDocument()
    expect(description1).toHaveTextContent('This number does not include a decimal point.')

    const [description2] = screen.getAllByTestId(locators.description2)
    expect(description2).toBeInTheDocument()
    expect(description2).toHaveTextContent(
      'To get the value including decimals, find the asset on the block explorer and divide the amount by 10decimals e.g. 1000 with a decimal value of 2 would become 1000 ÷ 102 = 10'
    )

    const [description3] = screen.getAllByTestId(locators.description3)
    expect(description3).toBeInTheDocument()
    expect(description3).toHaveTextContent('Read more')

    const [tooltipAssetExplorerLink] = screen.getAllByTestId(locators.tooltipAssetExplorerLink)
    expect(tooltipAssetExplorerLink).toBeInTheDocument()
    expect(tooltipAssetExplorerLink).toHaveAttribute('href', `${config.network.explorer}/assets/${assetId}`)
    expect(tooltipAssetExplorerLink).toHaveTextContent('asset')

    const [docsLink] = screen.getAllByTestId(locators.docsLink)

    expect(docsLink).toBeInTheDocument()
    expect(docsLink).toHaveAttribute('href', `${config.network.docs}/api/using-the-apis#decimal-precision`)
    expect(docsLink).toHaveTextContent('Read more')
  })
})
