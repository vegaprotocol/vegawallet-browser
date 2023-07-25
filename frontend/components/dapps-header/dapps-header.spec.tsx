import { fireEvent, render, screen } from '@testing-library/react'
import { DappsHeader, locators } from './wallets-header'

describe('WalletsHeader', () => {
  it('should render the wallets header and buttons', () => {
    render(<DappsHeader />)

    const walletsHeader = screen.getByTestId(locators.walletsHeader)
    const [tradeButton, governButton, browseButton] = screen.getAllByTestId(locators.walletsHeaderButton)

    expect(walletsHeader).toBeInTheDocument()

    expect(tradeButton).toHaveTextContent('Trade')
    expect(governButton).toHaveTextContent('Vote')
    expect(browseButton).toHaveTextContent('Browse')
  })

  it('renders the correct tooltip content', async () => {
    render(<DappsHeader />)

    const [tradeButton, governButton, browseButton] = screen.getAllByTestId(locators.walletsHeaderButton)
    fireEvent.pointerMove(tradeButton)
    await screen.findByRole('tooltip')

    expect(screen.queryByRole('tooltip')).toHaveTextContent('Console')
  })
})
