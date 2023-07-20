import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Wallets } from '.'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import locators from '../../../components/locators'

import { locators as walletLocators } from '../wallets/index'
import { mockClient } from '../../../test-helpers/mock-client'
import { WalletsStore, useWalletStore } from '../../../stores/wallets'
import { locators as keyLocators } from './key-list'
import { locators as depositAssetsCalloutLocators } from './deposit-assets-callout'
import { locators as signMessageLocators } from '../../../components/sign-message-dialog/sign-message'
import { locators as signedMessageLocators } from '../../../components/sign-message-dialog/signed-message'
import { locators as vegaKeyLocators } from '../../../components/vega-key'
import { locators as vegaKeyLocators } from '../../../components/keys/vega-key'

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
  const informationText =
    'Choose a market on Vega Console, connect your wallet and follow the prompts to deposit the funds needed to trade'
  beforeEach(() => {
    initialState = useWalletStore.getState()
  })
  afterEach(() => {
    // @ts-ignore
    global.browser = null
    act(() => useWalletStore.setState(initialState as WalletsStore))
  })

  it('renders the wallet page', async () => {
    // 1106-KEYS-005 There is a link from a key to the Block Explorer filtered transaction view

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
    expect(screen.getByTestId(vegaKeyLocators.explorerLink)).toBeVisible()
    expect(screen.getByTestId(vegaKeyLocators.explorerLink)).toHaveTextContent('07248a…3673')
    expect(screen.getByTestId(vegaKeyLocators.explorerLink)).toHaveAttribute(
      'href',
      'https://explorer.fairground.wtf/parties/07248acbd899061ba9c5f3ab47791df2045c8e249f1805a04c2a943160533673'
    )
    expect(screen.getByTestId(locators.copyWithCheck)).toBeInTheDocument()
    expect(screen.getByTestId(keyLocators.walletsKeyName)).toHaveTextContent('Key 1')
    expect(screen.getByTestId(keyLocators.walletsCreateKey)).toHaveTextContent('Create new key/pair')
    expect(screen.getByTestId(depositAssetsCalloutLocators.walletsAssetHeader)).toHaveTextContent(
      'Connect to console to deposit funds'
    )
    expect(screen.getByTestId(depositAssetsCalloutLocators.walletAssetDescription)).toHaveTextContent(informationText)
    expect(screen.getByTestId(depositAssetsCalloutLocators.walletsDepositLink)).toHaveTextContent('Vega Console dapp')
    expect(screen.getByTestId(depositAssetsCalloutLocators.walletsDepositLink)).toHaveAttribute(
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
    fireEvent.click(screen.getByTestId(keyLocators.walletsCreateKey))
    await waitFor(() => expect(screen.queryAllByTestId(locators.listItem)).toHaveLength(2))
    const [key1, key2] = screen.queryAllByTestId(locators.listItem)
    expect(key1).toHaveTextContent('Key 1')
    expect(key2).toHaveTextContent('Key 2')
  })

  it('allows you to sign a message with a key', async () => {
    mockClient()
    mockLoadedState()

    render(
      <JsonRPCProvider>
        <Wallets />
      </JsonRPCProvider>
    )
    // Wait for list to load
    await screen.findByTestId(locators.listItem)
    fireEvent.click(screen.getByTestId(keyLocators.walletsSignMessageButton))
    await waitFor(() => expect(screen.getByTestId(signMessageLocators.signMessageHeader)).toBeVisible())
    fireEvent.change(screen.getByTestId(signMessageLocators.messageInput), { target: { value: 'Test message' } })
    fireEvent.click(screen.getByTestId(signMessageLocators.signButton))
    await screen.findByTestId(signedMessageLocators.signedMessageHeader)
    expect(screen.getByText('signature')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId(signedMessageLocators.signedMessageDoneButton))
    await waitFor(() => expect(screen.queryByTestId(signedMessageLocators.signedMessageHeader)).not.toBeInTheDocument())
  })
})
