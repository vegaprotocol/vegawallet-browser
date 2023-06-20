import { MemoryRouter } from 'react-router-dom'
import { SaveMnemonic } from '.'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import locators from '../../../components/locators'
import { saveMnemonicButton, saveMnemonicDescription } from '../../../locator-ids'
import { FULL_ROUTES } from '../../route-names'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import { mockClient } from '../../../test-helpers/mock-client'

const mockedUsedNavigate = jest.fn()
const saveMnemonicDescriptionText =
  "Write down or save this recovery phrase to a safe place. You'll need it to recover your wallet. Never share this with anyone else."
const checkboxDescription = 'I understand that if I lose my recovery phrase, I lose access to my wallet and keys.'

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
    expect(screen.getByTestId(saveMnemonicDescription)).toHaveTextContent(saveMnemonicDescriptionText)
    expect(screen.getByTestId(saveMnemonicButton)).toHaveTextContent('Create wallet')
  })
  it('mnemonic and checkbox are shown when clicked', async () => {
    // 1101-BWAL-017 I can see an explanation of what the recovery phrase is for and that it cannot be recovered itself
    renderComponent()
    await screen.findByTestId(locators.mnemonicContainerHidden)
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    expect(screen.getByTestId(saveMnemonicDescription)).toHaveTextContent(saveMnemonicDescriptionText)
    expect(screen.getByTestId(saveMnemonicDescription)).toBeVisible()
    expect(screen.getByTestId(locators.checkboxWrapper)).toHaveTextContent(checkboxDescription)
    expect(screen.getByLabelText(checkboxDescription)).toBeVisible()
    expect(screen.getByTestId(locators.mnemonicContainerMnemonic)).toHaveTextContent(
      'Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word'
    )
    expect(screen.getByTestId(locators.mnemonicContainerMnemonic)).toBeVisible()
  })
  it('mnemonic is hidden when clicked after being shown', async () => {
    renderComponent()
    await screen.findByTestId(locators.mnemonicContainerHidden)
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    fireEvent.click(screen.getByTestId(locators.hideIcon))
    expect(screen.queryByTestId(locators.mnemonicContainerMnemonic)).not.toBeInTheDocument()
  })
  it('submit button is disabled if checkbox or recovery phrase is not revealed and checked, enabled if revealed and checked', async () => {
    // 1101-BWAL-020 I can verify that I understand that Vega doesn't store and therefore can't recover this recovery phrase if I lose it
    renderComponent()
    await screen.findByTestId(locators.mnemonicContainerHidden)
    expect(screen.getByTestId(saveMnemonicButton)).toBeDisabled()
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    expect(screen.getByTestId(saveMnemonicButton)).toBeDisabled()
    expect(screen.getByLabelText(checkboxDescription)).toBeVisible()

    fireEvent.click(screen.getByTestId('acceptedTerms'))
    expect(screen.getByTestId('acceptedTerms')).toBeChecked()
    expect(screen.getByTestId(saveMnemonicButton)).toBeEnabled()

    fireEvent.click(screen.getByTestId('acceptedTerms'))
    expect(screen.getByTestId('acceptedTerms')).not.toBeChecked()
    expect(screen.getByTestId(saveMnemonicButton)).toBeDisabled()
  })
  it('renders loading state when button is clicked', async () => {
    renderComponent()
    await screen.findByTestId(locators.mnemonicContainerHidden)
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    fireEvent.click(screen.getByLabelText(checkboxDescription))
    fireEvent.click(screen.getByTestId(saveMnemonicButton))
    await waitFor(() => expect(screen.queryByTestId(saveMnemonicButton)).toHaveTextContent('Creating wallet…'), {
      timeout: 1000
    })
    expect(screen.getByTestId(saveMnemonicButton)).toBeDisabled()
  })
  it('redirects to the wallets page when button is clicked', async () => {
    renderComponent()
    await screen.findByTestId(locators.mnemonicContainerHidden)
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    fireEvent.click(screen.getByLabelText(checkboxDescription))
    fireEvent.click(screen.getByTestId(saveMnemonicButton))
    await waitFor(() => expect(mockedUsedNavigate).toBeCalledWith(FULL_ROUTES.wallets))
  })
})
