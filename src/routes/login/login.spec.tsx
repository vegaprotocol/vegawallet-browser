import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Login } from '.'
import { MemoryRouter } from 'react-router-dom'
import locators from '../../components/locators'
import { loginButton, loginPassword } from '../../locator-ids'
import { FULL_ROUTES } from '../routes'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate
}))

const renderComponent = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

describe('Login', () => {
  it('renders title, stars and login button', () => {
    renderComponent()
    expect(screen.getByTestId(locators.splashWrapper)).toBeInTheDocument()
    expect(screen.getByTestId(loginPassword)).toBeInTheDocument()
    expect(screen.getByTestId(loginButton)).toBeInTheDocument()
  })
  it('renders error message if the password is incorrect', async () => {
    renderComponent()
    fireEvent.change(screen.getByTestId(loginPassword), {
      target: { value: 'incorrect-password' }
    })
    fireEvent.click(screen.getByTestId(loginButton))
    await screen.findByText('Incorrect password')
  })
  it('navigates to the wallets page if password is correct', async () => {
    renderComponent()
    fireEvent.change(screen.getByTestId(loginPassword), {
      target: { value: '123' }
    })
    fireEvent.click(screen.getByTestId(loginButton))
    await waitFor(() => expect(mockedUsedNavigate).toBeCalledWith(FULL_ROUTES.wallets))
  })
})
