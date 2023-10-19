import { render, screen } from '@testing-library/react'
import { AssetListEmptyState, locators } from './asset-list-empty-state'
import { mockStore } from '../../../../../test-helpers/mock-store'
import { useAssetsStore } from '../../../../../stores/assets-store'
import { useMarketsStore } from '../../../../../stores/markets-store'
import { locators as subheaderLocators } from '../../../../../components/sub-header'
import { locators as assetCardLocators } from './asset-card'

// Mocking useAssetsStore and useMarketsStore
jest.mock('../../../../../stores/assets-store')
jest.mock('../../../../../stores/markets-store', () => ({
  useMarketsStore: jest.fn()
}))

describe('AssetListEmptyState Component', () => {
  it('should display "Currently you have no assets." when no assets are available', () => {
    mockStore(useAssetsStore, {
      assets: []
    })
    mockStore(useMarketsStore, {
      getMarketsByAssetId: () => {
        return []
      }
    })
    render(<AssetListEmptyState publicKey="testPublicKey" />)

    expect(screen.getByTestId(locators.noAssets)).toHaveTextContent('Currently you have no assets.')
  })

  it('should display AssetCards for the top 2 assets when available', () => {
    const assets = [
      { id: 'asset1', details: { decimals: 1, symbol: 'A1', name: 'Asset 1' } },
      { id: 'asset2', details: { decimals: 1, symbol: 'A2', name: 'Asset 2' } },
      { id: 'asset3', details: { decimals: 1, symbol: 'A3', name: 'Asset 3' } }
    ]
    mockStore(useAssetsStore, {
      // TODO figure out why deep partial is not functional for arrays
      // @ts-ignore
      assets,
      getAssetById: (assetId: string) => assets.find(({ id }) => id === assetId)
    })
    mockStore(useMarketsStore, {
      getMarketsByAssetId: () => {
        return []
      }
    })
    render(<AssetListEmptyState publicKey="testPublicKey" />)

    expect(screen.getByTestId(subheaderLocators.subHeader)).toHaveTextContent('Balances')
    const assetCards = screen.getAllByTestId(assetCardLocators.assetCard)
    expect(assetCards).toHaveLength(2)
  })

  it('should nothing if asset does not have an id', () => {
    const assets = [{ details: { decimals: 1, symbol: 'A1', name: 'Asset 1' } }]
    mockStore(useAssetsStore, {
      // TODO figure out why deep partial is not functional for arrays
      // @ts-ignore
      assets,
      getAssetById: () => {
        throw new Error('Asset not found')
      }
    })
    mockStore(useMarketsStore, {
      getMarketsByAssetId: () => {
        return []
      }
    })
    render(<AssetListEmptyState publicKey="testPublicKey" />)

    expect(screen.getByTestId(subheaderLocators.subHeader)).toHaveTextContent('Balances')
    const assetCards = screen.queryAllByTestId(assetCardLocators.assetCard)
    expect(assetCards).toHaveLength(0)
  })
})
