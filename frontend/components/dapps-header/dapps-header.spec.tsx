import { fireEvent, render, screen } from '@testing-library/react'
import { DappsHeader, locators } from './dapps-header'
import config from '!/config'

describe('WalletsHeader', () => {
  it('should render the wallets header and buttons', () => {
    // 1106-KEYS-009 There is a way to go to console from the wallet view
    // 1106-KEYS-010 There is a way to go govern from the wallet view
    // 1106-KEYS-011 There is a way to view other Vega dapps from the wallet view
    render(<DappsHeader />)

    const walletsHeader = screen.getByTestId(locators.walletsHeader)
    const [tradeButton, governButton, browseButton] = screen.getAllByTestId(locators.walletsHeaderLink)

    expect(walletsHeader).toBeInTheDocument()

    expect(tradeButton).toHaveTextContent('Trade')
    expect(tradeButton).toHaveAttribute('href', config.network.console)
    expect(governButton).toHaveTextContent('Vote')
    expect(governButton).toHaveAttribute('href', config.network.governance)
    expect(browseButton).toHaveTextContent('Browse')
    expect(browseButton).toHaveAttribute('href', config.network.vegaDapps)
  })

  it('renders the correct tooltip content', async () => {
    // 1106-KEYS-012 There is a way to see what's linked to my wallet from the wallet view
    render(<DappsHeader />)

    const [tradeButton, governButton, browseButton] = screen.getAllByTestId(locators.walletsHeaderItem)
    fireEvent.pointerMove(tradeButton)
    await screen.findByRole('tooltip')
    expect(screen.queryByRole('tooltip')).toHaveTextContent('Console')
    fireEvent.pointerLeave(tradeButton)

    fireEvent.pointerMove(governButton)
    await screen.findByRole('tooltip')
    expect(screen.queryByRole('tooltip')).toHaveTextContent('Governance')
    fireEvent.pointerLeave(governButton)

    fireEvent.pointerMove(browseButton)
    await screen.findByRole('tooltip')
    expect(screen.queryByRole('tooltip')).toHaveTextContent('Vega dapps')
  })
})
