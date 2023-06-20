import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreatePassword } from '.'
import { MemoryRouter } from 'react-router-dom'
import { FULL_ROUTES } from '../../route-names'
import { confirmPassphraseInput, passphraseInput, submitPassphraseButton } from '../../../locator-ids'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import { mockClient } from '../../../test-helpers/mock-client'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

const renderComponent = () =>
  render(
    <JsonRPCProvider>
      <MemoryRouter>
        <CreatePassword />
      </MemoryRouter>
    </JsonRPCProvider>
  )

describe('CreatePassword', () => {
  beforeEach(() => {
    mockClient()
  })
  afterEach(() => {
    // @ts-ignore
    global.browser = null
  })
  it('should render correctly', () => {
    renderComponent()
    const passwordInfo = screen.getByText(
      "Set a password to protect and unlock your Vega Wallet. Your password can't be recovered or used to recover a wallet."
    )
    expect(passwordInfo).toBeInTheDocument()
  })

  it('should contain information and warnings about the wallet password', () => {
    // 1101-BWAL-002 I can see an explanation of what the password is for and that it cannot be used to recover my keys or recover itself
    renderComponent()
    expect(
      screen.getByText(
        "Set a password to protect and unlock your Vega Wallet. Your password can't be recovered or used to recover a wallet."
      )
    ).toBeVisible()
  })

  it('cannot navigate to next page until button is enabled', async () => {
    renderComponent()
    fireEvent.click(screen.getByTestId(submitPassphraseButton))
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled())
  })

  it('should keep button disabled if only password is filled in', async () => {
    renderComponent()
    fireEvent.click(screen.getByLabelText('I understand that Vega Wallet cannot recover this password if I lose it'))

    fireEvent.change(screen.getByTestId(passphraseInput), {
      target: { value: 'password1' }
    })

    expect(screen.getByTestId(submitPassphraseButton)).toBeDisabled()
  })

  it('should keep button disabled if no passwords are filled in', async () => {
    // 1101-BWAL-006 I can NOT submit an empty password
    renderComponent()
    fireEvent.click(screen.getByLabelText('I understand that Vega Wallet cannot recover this password if I lose it'))

    expect(screen.getByTestId(submitPassphraseButton)).toBeDisabled()
  })

  it('should keep button disabled if only confirm password is filled in', async () => {
    renderComponent()
    fireEvent.click(screen.getByLabelText('I understand that Vega Wallet cannot recover this password if I lose it'))

    fireEvent.change(screen.getByTestId(confirmPassphraseInput), {
      target: { value: 'password1' }
    })

    expect(screen.getByTestId(submitPassphraseButton)).toBeDisabled()
  })

  it('should show error message when passwords do not match', async () => {
    // 1101-BWAL-004 I can verify the password I set for my browser wallet (to help ensure I typed it correctly and can replicate it)
    renderComponent()
    fireEvent.change(screen.getByTestId(passphraseInput), {
      target: { value: 'password1' }
    })
    fireEvent.change(screen.getByTestId(confirmPassphraseInput), {
      target: { value: 'Password1' }
    })
    fireEvent.click(screen.getByLabelText('I understand that Vega Wallet cannot recover this password if I lose it'))

    fireEvent.click(screen.getByTestId(submitPassphraseButton))

    expect(await screen.findByText('Password does not match')).toBeInTheDocument()
  })

  it('should render loading state once the create button is pressed', async () => {
    renderComponent()

    fireEvent.change(screen.getByTestId(passphraseInput), {
      target: { value: 'test1234' }
    })
    fireEvent.change(screen.getByTestId(confirmPassphraseInput), {
      target: { value: 'test1234' }
    })

    const checkbox = screen.getByLabelText('I understand that Vega Wallet cannot recover this password if I lose it')
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    fireEvent.click(screen.getByTestId(submitPassphraseButton))
    await waitFor(() => expect(screen.getByTestId(submitPassphraseButton)).toHaveTextContent('Creating password…'))
  })

  it('should navigate to create wallet page when form is submitted with valid data', async () => {
    // 1101-BWAL-003 I can enter a password for the browser wallet
    // 1101-BWAL-005 I can verify that I understand that Vega doesn't store and therefore can't recover this password if I lose it
    renderComponent()

    fireEvent.change(screen.getByTestId(passphraseInput), {
      target: { value: 'test1234' }
    })
    fireEvent.change(screen.getByTestId(confirmPassphraseInput), {
      target: { value: 'test1234' }
    })

    const checkbox = screen.getByLabelText('I understand that Vega Wallet cannot recover this password if I lose it')
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    fireEvent.click(screen.getByTestId(submitPassphraseButton))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(FULL_ROUTES.createWallet))
  })
})
