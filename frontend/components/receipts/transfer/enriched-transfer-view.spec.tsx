import { render, screen } from '@testing-library/react'
import { EnrichedTransferView, locators as enrichedLocators } from './enriched-transfer-view'
import { Key, useWalletStore } from '../../../stores/wallets'
import { locators as vegaKeyLocators } from '../../keys/vega-key'
import { locators as priceWithSymbolLocators } from '../utils/string-amounts/amount-with-symbol'
import { AccountType } from '@vegaprotocol/protos/vega/AccountType'
import { useAssetsStore } from '../../../stores/assets-store'
import { vegaAsset, vegaAssetStatus } from '@vegaprotocol/rest-clients/dist/trading-data'
import { mockStore } from '../../../test-helpers/mock-store'

jest.mock('../../../stores/wallets', () => ({
  useWalletStore: jest.fn()
}))

jest.mock('../../../stores/assets-store', () => ({
  useAssetsStore: jest.fn()
}))

const mockTransaction = {
  transfer: {
    amount: '1',
    asset: '0'.repeat(64),
    to: '1'.repeat(64),
    fromAccountType: AccountType.ACCOUNT_TYPE_BOND,
    toAccountType: AccountType.ACCOUNT_TYPE_BOND,
    reference: 'reference',
    kind: null
  }
}

const mockAsset: vegaAsset = {
  id: 'b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663',
  details: {
    name: 'tDAI TEST',
    symbol: 'tDAI',
    decimals: '5',
    quantum: '1',
    erc20: {
      contractAddress: '0x26223f9C67871CFcEa329975f7BC0C9cB8FBDb9b',
      lifetimeLimit: '0',
      withdrawThreshold: '0'
    }
  },
  status: vegaAssetStatus.STATUS_ENABLED
}

const mockStores = (keyDetails: Key | undefined) => {
  mockStore(useAssetsStore, {
    loading: false,
    assets: [],
    getAssetById: jest.fn().mockReturnValue(mockAsset)
  })
  mockStore(useWalletStore, { getKeyById: () => keyDetails })
}

describe('EnrichedTransferView', () => {
  it('renders correctly', () => {
    // 1124-TRAN-006 I can see the enriched price details if the data is provided - correctly formatted decimals and asset name
    // 1124-TRAN-007 I can see enriched key details if the data is provided - whether the transfer is between own keys
    mockStores({
      index: 0,
      metadata: [],
      name: 'MyKey',
      publicKey: '1'.repeat(64)
    })

    render(<EnrichedTransferView transaction={mockTransaction} />)

    expect(screen.getByTestId(enrichedLocators.enrichedSection)).toBeInTheDocument()
    expect(screen.getByTestId(priceWithSymbolLocators.amountWithSymbol)).toBeInTheDocument()
    expect(screen.getByTestId(priceWithSymbolLocators.amount)).toHaveTextContent('0.00001')
    expect(screen.getByTestId(priceWithSymbolLocators.symbol)).toHaveTextContent('tDAI')
    expect(screen.getByTestId(vegaKeyLocators.keyName)).toHaveTextContent('MyKey (own key)')
  })

  it('renders external key if the transfer is not between own keys', () => {
    // 1124-TRAN-008 I can see enriched key details if the data is provided - whether the transfer is to an external key
    mockStores(undefined)

    render(<EnrichedTransferView transaction={mockTransaction} />)

    expect(screen.getByTestId(enrichedLocators.enrichedSection)).toBeInTheDocument()
    expect(screen.getByTestId(priceWithSymbolLocators.amountWithSymbol)).toBeInTheDocument()
    expect(screen.getByTestId(priceWithSymbolLocators.amount)).toHaveTextContent('0.00001')
    expect(screen.getByTestId(priceWithSymbolLocators.symbol)).toHaveTextContent('tDAI')
    expect(screen.getByTestId(vegaKeyLocators.keyName)).toHaveTextContent('External key')
  })
})
