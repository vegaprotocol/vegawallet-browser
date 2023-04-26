import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreatePassword } from '.'
import { MemoryRouter } from 'react-router-dom'
import { FULL_ROUTES } from '../../routes'

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

  it('should show validation errors when form is submitted with invalid data', async () => {
    renderComponent()
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: '123' }
    })
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: '321' }
    })
    fireEvent.click(
      screen.getByLabelText(
        'I understand that Vega Wallet cannot recover this password if I lose it'
      )
    )

    fireEvent.click(screen.getByRole('button', { name: /Submit/ }))

    expect(
      await screen.findByText('Password does not match')
    ).toBeInTheDocument()
  })

  it('should navigate to create wallet page when form is submitted with valid data', async () => {
    renderComponent()

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'test1234' }
    })
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'test1234' }
    })
    fireEvent.click(
      screen.getByLabelText(
        'I understand that Vega Wallet cannot recover this password if I lose it'
      )
    )
    fireEvent.click(screen.getByRole('button', { name: /Submit/ }))
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(FULL_ROUTES.createWallet)
    )
  })
})
