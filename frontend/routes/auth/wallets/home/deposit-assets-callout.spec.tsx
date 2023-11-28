import { render, screen } from '@testing-library/react'

import { DepositAssetsCallout, locators } from './deposit-assets-callout'

describe('DepositAssetsCallout', () => {
  it('renders the assets header', () => {
    render(<DepositAssetsCallout />)
    const assetsHeader = screen.getByTestId(locators.walletsAssetHeader)
    const description = screen.getByTestId(locators.walletAssetDescription)
    expect(assetsHeader).toBeVisible()
    expect(assetsHeader).toHaveTextContent('Connect to console to deposit funds')
    expect(description).toBeVisible()
    expect(description).toHaveTextContent(
      'Choose a market on Vega Console, connect your wallet and follow the prompts to deposit the funds needed to trade'
    )
  })

  it('renders the Vega Console dapp link', () => {
    // 1106-KEYS-003 I can see information of where to go to deposit and manage my assets
    render(<DepositAssetsCallout />)
    const depositLink = screen.getByTestId(locators.walletsDepositLink)
    expect(depositLink).toBeVisible()
    expect(depositLink).toHaveTextContent('Vega Console dapp')
    expect(depositLink).toHaveAttribute('href', 'https://console.fairground.wtf')
  })
})
