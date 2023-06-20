import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Wallets } from '.'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import locators from '../../../components/locators'
import {
  walletsAssetHeader,
  walletsCreateKey,
  walletsDepositLink,
  walletsError,
  walletsKeyName,
  walletsWalletName
} from '../../../locator-ids'
import { mockClient } from '../../../test-helpers/mock-client'
import { WalletsStore, useWalletStore } from './store'

describe('Wallets', () => {
  let initialState: WalletsStore | null = null
  const informationText = 'Deposit and manage your assets directly in a Vega dapp.'
  beforeEach(() => {
    initialState = useWalletStore.getState()
  })
  afterEach(() => {
    // @ts-ignore
    global.browser = null
    act(() => useWalletStore.setState(initialState as WalletsStore))
  })

  it('renders an error state', async () => {
    const listeners: Function[] = []

    // @ts-ignore
    global.browser = {
      runtime: {
        connect: () => ({
          postMessage: (message: any) => {
            listeners[0]({
              id: message.id,
              jsonrpc: '2.0',
              error: {
                message: 'Some error',
                code: 1,
                data: {}
              }
            })
          },
          onmessage: () => {},
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

    render(
      <JsonRPCProvider>
        <Wallets />
      </JsonRPCProvider>
    )
    await screen.findByTestId(walletsError)

    expect(screen.getByTestId(walletsError)).toHaveTextContent('Error: Some error')
  })

  it('renders the wallet page', async () => {
    mockClient()
    render(
      <JsonRPCProvider>
        <Wallets />
      </JsonRPCProvider>
    )
    // Wait for list to load
    await screen.findByTestId(locators.listItem)
    expect(screen.getByTestId(walletsWalletName)).toHaveTextContent('wallet 1')
    expect(screen.getByTestId(locators.copyWithCheck)).toHaveTextContent('07248a…3673')
    expect(screen.getByTestId(locators.copyWithCheck)).toBeInTheDocument()
    expect(screen.getByTestId(walletsKeyName)).toHaveTextContent('Key 1')
    expect(screen.getByTestId(walletsCreateKey)).toHaveTextContent('Create new key/pair')
    expect(screen.getByTestId(walletsAssetHeader)).toHaveTextContent('Assets')
    expect(screen.getByTestId(locators.frame)).toHaveTextContent(informationText)
    expect(screen.getByTestId(walletsDepositLink)).toHaveTextContent('a Vega dapp.')
    expect(screen.getByTestId(walletsDepositLink)).toHaveAttribute('href', 'https://console.fairground.wtf')
  })

  it('allows you to create another key', async () => {
    mockClient()
    render(
      <JsonRPCProvider>
        <Wallets />
      </JsonRPCProvider>
    )
    // Wait for list to load
    await screen.findByTestId(locators.listItem)
    fireEvent.click(screen.getByTestId(walletsCreateKey))
    await waitFor(() => expect(screen.queryAllByTestId(locators.listItem)).toHaveLength(2))
    const [key1, key2] = screen.queryAllByTestId(locators.listItem)
    expect(key1).toHaveTextContent('Key 1')
    expect(key2).toHaveTextContent('Key 2')
  })

  it('gives information of where to deposit and manage assets', async () => {
    // 1101-BWAL-067 I can see information of where to go to deposit and manage my assets
    mockClient()
    render(
      <JsonRPCProvider>
        <Wallets />
      </JsonRPCProvider>
    )
    // Wait for list to load
    await screen.findByTestId(locators.listItem)
    const infoElement = screen.getByTestId(locators.frame)
    expect(infoElement).toHaveTextContent(informationText)
    expect(infoElement).toBeVisible()
  })
})
