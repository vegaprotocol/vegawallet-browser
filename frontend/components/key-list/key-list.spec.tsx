import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { KeyList, KeyListProps, locators } from './key-list'
import config from '!/config'
import { JsonRPCProvider } from '../../contexts/json-rpc/json-rpc-provider'
import { mockClient } from '../../test-helpers/mock-client'
import componentLocators from '../locators'
import { locators as vegaKeyLocators } from '../keys/vega-key'
import { MemoryRouter } from 'react-router-dom'
import { Key } from '../../stores/wallets'

const storeMock = {
  createKey: jest.fn()
}

jest.mock('../../stores/wallets', () => ({
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

  test('renders component with correct header, explorer link, sign button and link to details page', () => {
    // 1106-KEYS-005 There is a link from a key to the Block Explorer filtered transaction view
    // 1125-KEYS-015 From the main wallets screen I can click on a key to be shown the list of assets on that key
    const keys = [
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
    renderComponent({ keys })

    const header = screen.getByText('Keys')
    const keyNames = screen.getAllByTestId(vegaKeyLocators.keyName)
    const explorerLink = screen.getAllByTestId(vegaKeyLocators.explorerLink)
    const copyWithCheck = screen.getAllByTestId(componentLocators.copyWithCheck)

    expect(header).toBeInTheDocument()
    expect(keyNames).toHaveLength(keys.length)
    expect(explorerLink).toHaveLength(keys.length)

    expect(header.textContent).toEqual('Keys')

    keys.forEach((key, index) => {
      expect(keyNames[index]).toHaveTextContent(key.name)
      expect(explorerLink[index]).toHaveAttribute('href', `${config.network.explorer}/parties/${key.publicKey}`)
      expect(copyWithCheck[index]).toBeVisible()
    })
  })
})
