import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ImportWallet } from '.'
import { importMnemonic, importMnemonicDescription, importMnemonicSubmit } from '../../../locator-ids'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import { mockClient } from '../../../test-helpers/mock-client'
import { FULL_ROUTES } from '../../route-names'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate
}))

const renderComponent = () => {
  render(
    <JsonRPCProvider>
      <MemoryRouter>
        <ImportWallet />
      </MemoryRouter>
    </JsonRPCProvider>
  )
}

describe('ImportWallet', () => {
  it('renders description, input and submit button', () => {
    mockClient()
    renderComponent()
    expect(screen.getByTestId(importMnemonicDescription)).toHaveTextContent(
      "Enter or paste in your Vega wallet's recovery phrase."
    )
    expect(screen.getByTestId(importMnemonic)).toBeInTheDocument()
    expect(screen.getByTestId(importMnemonicSubmit)).toHaveTextContent('Import wallet')
  })

  it('after successfully importing a wallet it redirects to wallets page', async () => {
    mockClient()
    renderComponent()

    expect(screen.getByTestId(importMnemonicDescription)).toHaveTextContent(
      "Enter or paste in your Vega wallet's recovery phrase."
    )
    fireEvent.change(screen.getByTestId(importMnemonic), {
      target: {
        value:
          'solid length discover gun swear nose artwork unfair vacuum canvas push hybrid owner wasp arrest mixed oak miss cage scatter tree harsh critic believe'
      }
    })
    fireEvent.click(screen.getByTestId(importMnemonicSubmit))

    await waitFor(() => expect(mockedUsedNavigate).toBeCalledWith(FULL_ROUTES.wallets))
  })

  it('requires mnemonic should be 24 words', async () => {
    mockClient()
    renderComponent()
    fireEvent.change(screen.getByTestId(importMnemonic), {
      target: { value: 'bad mnemonic' }
    })
    fireEvent.click(screen.getByTestId(importMnemonicSubmit))
    await screen.findByText('Recovery phrase must be 24 words')
    expect(screen.getByTestId(importMnemonicSubmit)).toBeDisabled()
  })

  it('renders error message if recovery phrase is invalid', async () => {
    const listeners: Function[] = []
    // @ts-ignore
    global.browser = {
      runtime: {
        connect: () => ({
          postMessage: (message: any) => {
            listeners[0]({
              jsonrpc: '2.0',
              error: {
                message: 'Invalid recovery phrase',
                // TODO correct error code
                code: -32602
              },
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
    fireEvent.change(screen.getByTestId(importMnemonic), {
      target: {
        value: 'bad bad bad bad bad bad bad bad bad bad bad bad bad bad bad bad bad bad bad bad bad bad bad bad'
      }
    })
    fireEvent.click(screen.getByTestId(importMnemonicSubmit))
    await screen.findByText('Error: Invalid recovery phrase')
    expect(screen.getByTestId(importMnemonicSubmit)).toBeDisabled()
  })
})
