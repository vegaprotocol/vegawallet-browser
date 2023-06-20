import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ImportWallet } from '.'
import { importMnemonic, importMnemonicDescription, importMnemonicSubmit } from '../../../locator-ids'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import { mockClient } from '../../../test-helpers/mock-client'
import { FULL_ROUTES } from '../../route-names'
import { validRecoveryPhrase } from '../../../../test/e2e/wallet-helpers/common'

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
    // 1101-BWAL-075 I can see an explanation of what I am being asked to do
    mockClient()
    renderComponent()
    expect(screen.getByTestId(importMnemonicDescription)).toHaveTextContent(
      "Enter or paste in your Vega wallet's recovery phrase."
    )
    expect(screen.getByTestId(importMnemonicDescription)).toBeVisible()
    expect(screen.getByTestId(importMnemonic)).toBeInTheDocument()
    expect(screen.getByTestId(importMnemonicSubmit)).toHaveTextContent('Import wallet')
  })

  it('renders loading state while wallet is being imported', async () => {
    // 1101-BWAL-078 - I can see the button is disabled and a loading state after submitting
    mockClient()
    renderComponent()
    fireEvent.change(screen.getByTestId(importMnemonic), {
      target: {
        value:
          'solid length discover gun swear nose artwork unfair vacuum canvas push hybrid owner wasp arrest mixed oak miss cage scatter tree harsh critic believe'
      }
    })
    fireEvent.click(screen.getByTestId(importMnemonicSubmit))

    await waitFor(() => expect(screen.getByTestId(importMnemonicSubmit)).toHaveTextContent('Importing…'))
    expect(screen.getByTestId(importMnemonicSubmit)).toBeDisabled()
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
    // 1101-BWAL-079 I can not hit submit until I have entered 24 words (and given feedback that I haven't met the min number of words)
    mockClient()
    const twentyThreeWords =
      'one two three four five six seven eight nine ten eleven twelve thirteen fouteen fifteen sixteen seventeen eighteen ninteen twenty twenty-one twenty-two twenty-three'
    renderComponent()
    fireEvent.change(screen.getByTestId(importMnemonic), {
      target: { value: twentyThreeWords }
    })
    const errorMessage = await screen.findByText('Recovery phrase must be 24 words')
    expect(errorMessage).toBeVisible()
    expect(screen.getByTestId(importMnemonicSubmit)).toBeDisabled()
    fireEvent.change(screen.getByTestId(importMnemonic), {
      target: { value: twentyThreeWords + ' twentyfour' }
    })

    await waitFor(() => expect(screen.getByTestId(importMnemonicSubmit)).not.toBeDisabled())
  })

  it('renders error message if recovery phrase is invalid', async () => {
    // 1101-BWAL-080 If I submit a recovery phrase I am given feedback if the words are invalid i.e. no wallet found with that recovery phrase (and I can try again)
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
        value: validRecoveryPhrase.slice(0, -1)
      }
    })
    fireEvent.click(screen.getByTestId(importMnemonicSubmit))
    await screen.findByText('Error: Invalid recovery phrase')
    expect(screen.getByTestId(importMnemonicSubmit)).toBeDisabled()
  })
})
