import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Login } from '.'
import { MemoryRouter } from 'react-router-dom'
import componentLocators from '../../components/locators'
import { JsonRPCProvider } from '../../contexts/json-rpc/json-rpc-provider'
import { mockClient } from '../../test-helpers/mock-client'
import { FULL_ROUTES } from '../route-names'
import { locators } from '.'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate
}))

const renderComponent = () =>
  render(
    <JsonRPCProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </JsonRPCProvider>
  )

describe('Login', () => {
  it('renders title, stars and login button', () => {
    mockClient()
    renderComponent()
    expect(screen.getByTestId(componentLocators.splashWrapper)).toBeInTheDocument()
    expect(screen.getByTestId(locators.loginPassphrase)).toHaveFocus()
    expect(screen.getByTestId(locators.loginButton)).toBeInTheDocument()
  })
  it('renders error message if the passphrase is incorrect', async () => {
    mockClient()
    renderComponent()
    fireEvent.change(screen.getByTestId(locators.loginPassphrase), {
      target: { value: 'incorrect-passphrase' }
    })
    fireEvent.click(screen.getByTestId(locators.loginButton))
    await screen.findByText('Incorrect passphrase')
  })
  it('navigates to the wallets page if passphrase is correct', async () => {
    mockClient()
    renderComponent()
    fireEvent.change(screen.getByTestId(locators.loginPassphrase), {
      target: { value: 'passphrase' }
    })
    fireEvent.click(screen.getByTestId(locators.loginButton))
    await waitFor(() => expect(mockedUsedNavigate).toBeCalledWith(FULL_ROUTES.home))
  })
  it('renders loading state on login button', async () => {
    // 1102-LGIN-004 - I can see the button is disabled and a loading state after submitting
    mockClient()
    renderComponent()
    fireEvent.change(screen.getByTestId(locators.loginPassphrase), {
      target: { value: 'passphrase' }
    })
    fireEvent.click(screen.getByTestId(locators.loginButton))
    await waitFor(() => expect(screen.getByTestId(locators.loginButton)).toHaveTextContent('Logging in…'))
    expect(screen.getByTestId(locators.loginButton)).toBeDisabled()
  })
  it('renders error if unknown error occurs', async () => {
    const listeners: Function[] = []
    // @ts-ignore
    global.browser = {
      runtime: {
        connect: () => ({
          postMessage: (message: any) => {
            listeners[0]({
              jsonrpc: '2.0',
              error: { code: 1, message: 'Some error' },
              id: message.id
            })
          },
          onmessage: (...args: any[]) => {
            console.log('om', args)
          },
          onMessage: {
            addListener: (fn: any) => {
              listeners.push(fn)
            }
          },
          onDisconnect: {
            addListener: (fn: any) => {}
          }
        })
      }
    }
    renderComponent()
    fireEvent.change(screen.getByTestId(locators.loginPassphrase), {
      target: { value: 'incorrect-passphrase' }
    })
    fireEvent.click(screen.getByTestId(locators.loginButton))
    await screen.findByText('Unknown error occurred Error: Some error')
  })
})
