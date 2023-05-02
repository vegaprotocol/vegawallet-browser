import { MemoryRouter } from 'react-router-dom'
import { SaveMnemonic } from '.'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import locators from '../../../components/locators'
import { saveMnemonicButton, saveMnemonicDescription } from '../../../locator-ids'
import { FULL_ROUTES } from '../../routes'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import { mockClient } from '../../../test-helpers/mock-client'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate
}))

const renderComponent = () =>
  render(
    <JsonRPCProvider>
      <MemoryRouter>
        <SaveMnemonic />
      </MemoryRouter>
    </JsonRPCProvider>
  )

describe('Save mnemonic', () => {
  beforeEach(() => {
    mockClient()
  })
  afterEach(() => {
    // @ts-ignore
    global.browser = null
  })
  it('renders tile, disclaimer and button', async () => {
    renderComponent()
    await screen.findByTestId(locators.mnemonicContainerHidden)
    expect(screen.getByTestId('secure-your-wallet')).toHaveTextContent('Secure your wallet')
    expect(screen.getByTestId(locators.mnemonicContainerHidden)).toBeInTheDocument()
    expect(screen.getByTestId(saveMnemonicDescription)).toHaveTextContent(
      "Write down or save this recovery phrase to a safe place. You'll need it to recover your wallet. Never share this with anyone else."
    )
    expect(screen.getByTestId(saveMnemonicButton)).toHaveTextContent('Continue')
  })
  it('mnemonic and checkbox are shown when clicked', async () => {
    renderComponent()
    await screen.findByTestId(locators.mnemonicContainerHidden)
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    expect(screen.getByTestId(locators.checkboxWrapper)).toHaveTextContent(
      'I understand that if I lose my recovery phrase, I lose access to my wallet and keys.'
    )
    expect(screen.getByTestId(locators.mnemonicContainerMnemonic)).toHaveTextContent(
      'Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word'
    )
  })
  it('mnemonic is hidden when clicked after being shown', async () => {
    renderComponent()
    await screen.findByTestId(locators.mnemonicContainerHidden)
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    fireEvent.click(screen.getByTestId(locators.hideIcon))
    expect(screen.queryByTestId(locators.mnemonicContainerMnemonic)).not.toBeInTheDocument()
  })
  it('submit button is disabled if checkbox is not pressed', async () => {
    renderComponent()
    await screen.findByTestId(locators.mnemonicContainerHidden)
    expect(screen.getByTestId(saveMnemonicButton)).toBeDisabled()
  })
  it('redirects to the wallets page when button is clicked', async () => {
    renderComponent()
    await screen.findByTestId(locators.mnemonicContainerHidden)
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    fireEvent.click(
      screen.getByLabelText('I understand that if I lose my recovery phrase, I lose access to my wallet and keys.')
    )
    fireEvent.click(screen.getByTestId(saveMnemonicButton))
    await waitFor(() => expect(mockedUsedNavigate).toBeCalledWith(FULL_ROUTES.wallets))
  })
})
