import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import config from '!/config'
import { JsonRPCProvider } from '@/contexts/json-rpc/json-rpc-provider'
import { mockClient } from '@/test-helpers/mock-client'

import { locators as vegaKeyLocators } from '../keys/vega-key'
import componentLocators from '../locators'
import { KeyList, KeyListProperties } from './key-list'

const storeMock = {
  createKey: jest.fn()
}

jest.mock('@/stores/wallets', () => ({
  useWalletStore: (function_: any) => function_(storeMock)
}))

const renderComponent = (properties: KeyListProperties) =>
  render(
    <MemoryRouter>
      <JsonRPCProvider>
        <KeyList {...properties} />
      </JsonRPCProvider>
    </MemoryRouter>
  )

describe('KeyList', () => {
  beforeEach(() => {
    mockClient()
  })

  it('renders component with correct header, explorer link, sign button and link to details page', () => {
    // 1106-KEYS-005 There is a link from a key to the Block Explorer filtered transaction view
    // 1106-KEYS-015 From the main wallets screen I can click on a key to be shown the list of assets on that key
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

    expect(header.textContent).toBe('Keys')

    for (const [index, key] of keys.entries()) {
      expect(keyNames[index]).toHaveTextContent(key.name)
      expect(explorerLink[index]).toHaveAttribute('href', `${config.network.explorer}/parties/${key.publicKey}`)
      expect(copyWithCheck[index]).toBeVisible()
    }
  })
})
