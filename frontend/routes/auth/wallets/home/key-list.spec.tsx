import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { KeyList, KeyListProps, locators } from './key-list'
import config from '!/config'
import { JsonRPCProvider } from '../../../../contexts/json-rpc/json-rpc-provider'
import { mockClient } from '../../../../test-helpers/mock-client'
import componentLocators from '../../../../components/locators'
import { locators as vegaKeyLocators } from '../../../../components/keys/vega-key'
import { MemoryRouter } from 'react-router-dom'

const storeMock = {
  createKey: jest.fn()
}

jest.mock('../../../../stores/wallets', () => ({
  useWalletStore: (fn: any) => fn(storeMock)
}))

const renderComponent = (props: KeyListProps) =>
  render(
    <MemoryRouter>
      <JsonRPCProvider>
        <KeyList {...props} />
      </JsonRPCProvider>
    </MemoryRouter>
  )

describe('KeyList', () => {
  beforeEach(() => {
    mockClient()
  })

  test('renders component with correct header, explorer link, sign button and link to detials page', () => {
    // 1106-KEYS-005 There is a link from a key to the Block Explorer filtered transaction view
    // 1125-KEYS-015 From the main wallets screen I can click on a key to be shown the list of assets on that key
    const wallet = {
      name: 'Test Wallet',
      keys: [
        {
          publicKey: 'publicKey1',
          name: 'Key 1',
          index: 1,
          metadata: []
        },
        {
          publicKey: 'publicKey2',
          name: 'Key 2',
          index: 1,
          metadata: []
        }
      ]
    }
    const onIconClick = jest.fn()
    renderComponent({ wallet, onIconClick })

    const header = screen.getByText('Keys')
    const keys = screen.getAllByTestId(vegaKeyLocators.keyName)
    const explorerLink = screen.getAllByTestId(vegaKeyLocators.explorerLink)
    const copyWithCheck = screen.getAllByTestId(componentLocators.copyWithCheck)
    const createKeyButton = screen.getByTestId(locators.walletsCreateKey)

    expect(header).toBeInTheDocument()
    expect(keys).toHaveLength(wallet.keys.length)
    expect(explorerLink).toHaveLength(wallet.keys.length)
    expect(createKeyButton).toBeInTheDocument()

    expect(header.textContent).toEqual('Keys')

    wallet.keys.forEach((key, index) => {
      expect(keys[index]).toHaveTextContent(key.name)
      expect(explorerLink[index]).toHaveAttribute('href', `${config.network.explorer}/parties/${key.publicKey}`)
      expect(copyWithCheck[index]).toBeVisible()
    })
  })

  test('calls onIconClick when icon button is clicked', () => {
    const wallet = {
      name: 'Test Wallet',
      keys: [
        {
          publicKey: 'publicKey1',
          name: 'Key 1',
          index: 1,
          metadata: []
        }
      ]
    }
    const onIconClick = jest.fn()

    renderComponent({ wallet, onIconClick })

    fireEvent.click(screen.getByTestId(locators.walletsSignMessageButton))

    expect(onIconClick).toHaveBeenCalledWith('publicKey1')
  })

  test('calls createNewKey when create key button is clicked', async () => {
    const wallet = {
      name: 'Test Wallet',
      keys: []
    }

    renderComponent({ wallet, onIconClick: jest.fn() })

    fireEvent.click(screen.getByTestId(locators.walletsCreateKey))
    await waitFor(() => expect(storeMock.createKey).toHaveBeenCalled())
  })
})
