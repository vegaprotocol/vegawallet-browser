import { MemoryRouter } from 'react-router-dom'
import { CreateWallet } from '.'
import locators from '../../../components/locators'
import { createWalletButton, importWalletButton } from '../../../locator-ids'
import { fireEvent, render, screen } from '@testing-library/react'
import { FULL_ROUTES } from '../../routes'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

const renderComponent = () =>
  render(
    <MemoryRouter>
      <CreateWallet />
    </MemoryRouter>
  )

describe('Create wallet', () => {
  it('renders icon and buttons', () => {
    renderComponent()
    expect(screen.getByTestId(locators.walletIcon)).toBeInTheDocument()
    expect(screen.getByTestId(createWalletButton)).toHaveTextContent(
      'Create a wallet'
    )
    expect(screen.getByTestId(importWalletButton)).toHaveTextContent(
      'Import - Coming Soon'
    )
  })

  it('renders import wallet as disabled', () => {
    renderComponent()
    expect(screen.getByTestId(importWalletButton)).toBeDisabled()
  })

  it('navigates to create wallet route when create wallet button is pressed', async () => {
    renderComponent()
    fireEvent.click(screen.getByTestId(createWalletButton))
    expect(mockNavigate).toBeCalledWith(FULL_ROUTES.saveMnemonic)
  })
})
