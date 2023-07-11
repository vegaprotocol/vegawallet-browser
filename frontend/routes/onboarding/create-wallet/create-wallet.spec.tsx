import { MemoryRouter } from 'react-router-dom'
import { CreateWallet } from '.'
import locators from '../../../components/locators'
import { createNewWalletButton, importWalletButton } from '../../../locator-ids'
import { fireEvent, render, screen } from '@testing-library/react'
import { FULL_ROUTES } from '../../route-names'

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
    expect(screen.getByTestId(createNewWalletButton)).toHaveTextContent('Create a wallet')
    expect(screen.getByTestId(createNewWalletButton)).toHaveFocus()
    expect(screen.getByTestId(importWalletButton)).toHaveTextContent('Import a Wallet')
  })

  it('navigates to import wallet page when import button is pressed', () => {
    renderComponent()
    fireEvent.click(screen.getByTestId(importWalletButton))
    expect(mockNavigate).toBeCalledWith(FULL_ROUTES.importWallet)
  })

  it('navigates to save mnemonic route when create wallet button is pressed', async () => {
    renderComponent()
    fireEvent.click(screen.getByTestId(createNewWalletButton))
    expect(mockNavigate).toBeCalledWith(FULL_ROUTES.saveMnemonic)
  })
})
