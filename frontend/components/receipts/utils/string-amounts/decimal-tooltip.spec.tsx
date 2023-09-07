import { render, screen } from '@testing-library/react'
import { DecimalTooltip, locators } from './decimal-tooltip'
import config from '!/config'

describe('DecimalTooltip', () => {
  it('renders and description the explorer link and docs links', () => {
    // 1114-RCPT-009 I can see an explanation of how to calculate the human readable price from the raw price
    // 1114-RCPT-010 I can see a link to the docs to read more about the price
    // 1114-RCPT-011 I can click on a link to go to the block explorer to see the asset information
    render(<DecimalTooltip variableName="decimals" entityLink="https://example.com" entityText="asset" />)

    const [description1] = screen.getAllByTestId(locators.description1)
    expect(description1).toBeInTheDocument()
    expect(description1).toHaveTextContent('This number does not include a decimal point.')

    const [description2] = screen.getAllByTestId(locators.description2)
    expect(description2).toBeInTheDocument()
    expect(description2).toHaveTextContent(
      'To get the value including decimals, find the asset on the block explorer and divide the amount by 10decimals e.g. 1000 with a decimals value of 2 would become 1000 ÷ 102 = 10.'
    )

    const [description3] = screen.getAllByTestId(locators.description3)
    expect(description3).toBeInTheDocument()
    expect(description3).toHaveTextContent('Read more')

    const [tooltipAssetExplorerLink] = screen.getAllByTestId(locators.explorerLink)
    expect(tooltipAssetExplorerLink).toBeInTheDocument()
    expect(tooltipAssetExplorerLink).toHaveAttribute('href', 'https://example.com')
    expect(tooltipAssetExplorerLink).toHaveTextContent('asset')

    const [docsLink] = screen.getAllByTestId(locators.docsLink)

    expect(docsLink).toBeInTheDocument()
    expect(docsLink).toHaveAttribute('href', `${config.network.docs}/api/using-the-apis#decimal-precision`)
    expect(docsLink).toHaveTextContent('Read more')
  })
})
