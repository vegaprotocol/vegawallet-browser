import { render, screen } from '@testing-library/react'
import { DepositAssetsCallout, locators } from './deposit-assets-callout'

describe('DepositAssetsCallout', () => {
  it('renders the assets header', () => {
    render(<DepositAssetsCallout />)
    const assetsHeader = screen.getByTestId(locators.walletsAssetHeader)
    expect(assetsHeader).toBeInTheDocument()
    expect(assetsHeader).toHaveTextContent('Assets')
  })

  it('renders the Vega Console dapp link', () => {
    // 1106-KEYS-003 I can see information of where to go to deposit and manage my assets
    render(<DepositAssetsCallout />)
    const depositLink = screen.getByTestId(locators.walletsDepositLink)
    expect(depositLink).toBeInTheDocument()
    expect(depositLink).toHaveTextContent('Vega Console dapp.')
    expect(depositLink).toHaveAttribute('href', 'https://console.fairground.wtf')
  })
})
