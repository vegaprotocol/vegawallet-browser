import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Wallets } from '.'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import locators from '../../../components/locators'

import { locators as walletLocators } from '../wallets/index'
import { mockClient } from '../../../test-helpers/mock-client'
import { WalletsStore, useWalletStore } from '../../../stores/wallets'

const mockLoadedState = () => {
  const state = useWalletStore.getState()

  useWalletStore.setState({
    ...state,
    loading: false,
    wallets: [
      {
        name: 'wallet 1',
        keys: [
          {
            publicKey: '07248acbd899061ba9c5f3ab47791df2045c8e249f1805a04c2a943160533673',
            name: 'Key 1',
            index: 2147483650,
            metadata: []
          }
        ]
      }
    ]
  })
}

describe('Wallets', () => {
  let initialState: WalletsStore | null = null
  const informationText = 'Deposit and manage your assets directly in the Vega Console dapp.'
  beforeEach(() => {
    initialState = useWalletStore.getState()
  })
  afterEach(() => {
    // @ts-ignore
    global.browser = null
    act(() => useWalletStore.setState(initialState as WalletsStore))
  })

  it('renders the wallet page', async () => {
    // 1106-KEYS-005 rom a key, there is a link from a key to the Block Explorer filtered transaction view

    mockClient()
    mockLoadedState()
    render(
      <JsonRPCProvider>
        <Wallets />
      </JsonRPCProvider>
    )
    // Wait for list to load
    await screen.findByTestId(locators.listItem)
    expect(screen.getByTestId(walletLocators.walletsWalletName)).toHaveTextContent('wallet 1')
    expect(screen.getByTestId(walletLocators.walletsExplorerLink)).toHaveTextContent('07248a…3673')
    expect(screen.getByTestId(walletLocators.walletsExplorerLink)).toHaveAttribute(
      'href',
      'https://explorer.fairground.wtf/parties/07248acbd899061ba9c5f3ab47791df2045c8e249f1805a04c2a943160533673'
    )
    expect(screen.getByTestId(locators.copyWithCheck)).toBeInTheDocument()
    expect(screen.getByTestId(walletLocators.walletsKeyName)).toHaveTextContent('Key 1')
    expect(screen.getByTestId(walletLocators.walletsCreateKey)).toHaveTextContent('Create new key/pair')
    expect(screen.getByTestId(walletLocators.walletsAssetHeader)).toHaveTextContent('Assets')
    expect(screen.getByTestId(locators.frame)).toHaveTextContent(informationText)
    expect(screen.getByTestId(walletLocators.walletsDepositLink)).toHaveTextContent('Vega Console dapp.')
    expect(screen.getByTestId(walletLocators.walletsDepositLink)).toHaveAttribute(
      'href',
      'https://console.fairground.wtf'
    )
  })

  it('allows you to create another key', async () => {
    mockClient()
    mockLoadedState()

    render(
      <JsonRPCProvider>
        <Wallets />
      </JsonRPCProvider>
    )
    // Wait for list to load
    await screen.findByTestId(locators.listItem)
    fireEvent.click(screen.getByTestId(walletLocators.walletsCreateKey))
    await waitFor(() => expect(screen.queryAllByTestId(locators.listItem)).toHaveLength(2))
    const [key1, key2] = screen.queryAllByTestId(locators.listItem)
    expect(key1).toHaveTextContent('Key 1')
    expect(key2).toHaveTextContent('Key 2')
  })

  it('gives information of where to deposit and manage assets', async () => {
    // 1106-KEYS-003 I can see information of where to go to deposit and manage my assets
    mockClient()
    mockLoadedState()

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
