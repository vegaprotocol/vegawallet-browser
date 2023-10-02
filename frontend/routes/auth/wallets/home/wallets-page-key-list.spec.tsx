import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { WalletsPageKeyList, WalletPageKeyListProps, locators } from './wallets-page-key-list'
import { JsonRPCProvider } from '../../../../contexts/json-rpc/json-rpc-provider'
import { mockClient } from '../../../../test-helpers/mock-client'
import { MemoryRouter } from 'react-router-dom'
import { locators as keyListLocators } from '../../../../components/key-list'

const storeMock = {
  createKey: jest.fn()
}

jest.mock('../../../../stores/wallets', () => ({
  useWalletStore: (fn: any) => fn(storeMock)
}))

const renderComponent = (props: WalletPageKeyListProps) =>
  render(
    <MemoryRouter>
      <JsonRPCProvider>
        <WalletsPageKeyList {...props} />
      </JsonRPCProvider>
    </MemoryRouter>
  )

describe('WalletsPageKeyList', () => {
  beforeEach(() => {
    mockClient()
  })

  test('renders key list component', () => {
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
    renderComponent({ wallet, onSignMessage: jest.fn() })
    expect(screen.getByTestId(keyListLocators.viewDetails(wallet.keys[0].name))).toBeInTheDocument()
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

    renderComponent({ wallet, onSignMessage: onIconClick })

    fireEvent.click(screen.getByTestId(locators.walletsSignMessageButton))

    expect(onIconClick).toHaveBeenCalledWith('publicKey1')
  })

  test('calls createNewKey when create key button is clicked', async () => {
    const wallet = {
      name: 'Test Wallet',
      keys: []
    }

    renderComponent({ wallet, onSignMessage: jest.fn() })

    fireEvent.click(screen.getByTestId(locators.walletsCreateKey))
    await waitFor(() => expect(storeMock.createKey).toHaveBeenCalled())
  })
})
