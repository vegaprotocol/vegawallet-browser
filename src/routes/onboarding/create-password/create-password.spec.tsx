import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreatePassword } from '.'
import { MemoryRouter } from 'react-router-dom'
import { FULL_ROUTES } from '../../routes'
import {
  confirmPasswordInput,
  passwordInput,
  submitPasswordButton
} from '../../../locator-ids'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

const renderComponent = () =>
  render(
    <MemoryRouter>
      <CreatePassword />
    </MemoryRouter>
  )

describe('CreatePassword', () => {
  it('should render correctly', () => {
    renderComponent()
    expect(
      screen.getByText(
        "Set a password to protect and unlock your Vega Wallet. Your password can't be recovered or used to recover a wallet."
      )
    ).toBeInTheDocument()
  })

  it('cannot navigate to next page until button is enabled', async () => {
    renderComponent()
    fireEvent.click(screen.getByTestId(submitPasswordButton))
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled())
  })

  it('should keep button disabled if only password is filled in', async () => {
    renderComponent()
    fireEvent.click(
      screen.getByLabelText(
        'I understand that Vega Wallet cannot recover this password if I lose it'
      )
    )

    fireEvent.change(screen.getByTestId(passwordInput), {
      target: { value: 'password1' }
    })

    expect(screen.getByTestId(submitPasswordButton)).toBeDisabled()
  })

  it('should keep button disabled if only confirm password is filled in', async () => {
    renderComponent()
    fireEvent.click(
      screen.getByLabelText(
        'I understand that Vega Wallet cannot recover this password if I lose it'
      )
    )

    fireEvent.change(screen.getByTestId(confirmPasswordInput), {
      target: { value: 'password1' }
    })

    expect(screen.getByTestId(submitPasswordButton)).toBeDisabled()
  })

  it('should show error message when passwords do not match', async () => {
    renderComponent()
    fireEvent.change(screen.getByTestId(passwordInput), {
      target: { value: 'password1' }
    })
    fireEvent.change(screen.getByTestId(confirmPasswordInput), {
      target: { value: 'Password1' }
    })
    fireEvent.click(
      screen.getByLabelText(
        'I understand that Vega Wallet cannot recover this password if I lose it'
      )
    )

    fireEvent.click(screen.getByTestId(submitPasswordButton))

    expect(
      await screen.findByText('Password does not match')
    ).toBeInTheDocument()
  })

  it('should navigate to create wallet page when form is submitted with valid data', async () => {
    renderComponent()

    fireEvent.change(screen.getByTestId(passwordInput), {
      target: { value: 'test1234' }
    })
    fireEvent.change(screen.getByTestId(confirmPasswordInput), {
      target: { value: 'test1234' }
    })
    fireEvent.click(
      screen.getByLabelText(
        'I understand that Vega Wallet cannot recover this password if I lose it'
      )
    )
    fireEvent.click(screen.getByTestId(submitPasswordButton))

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(FULL_ROUTES.createWallet)
    )
  })
})
