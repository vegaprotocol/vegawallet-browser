import { render, screen } from '@testing-library/react'
import { KeyDetailsPage, locators } from './key-details-page'
import { useAssetsStore } from '../../../../stores/assets-store'
import { useAccounts } from './use-accounts'
import { silenceErrors } from '../../../../test-helpers/silence-errors'

jest.mock('./key-selector', () => ({
  KeySelector: () => <div data-testid="key-selector" />
}))

jest.mock('../../../../components/keys/vega-key', () => ({
  VegaKey: () => <div data-testid="vega-key" />
}))

jest.mock('./asset-card', () => ({
  AssetCard: () => <div data-testid="asset-card" />
}))

jest.mock('./use-accounts')
jest.mock('../../../../stores/assets-store')

const id = '1'.repeat(64)

describe('KeyDetailsPage', () => {
  it('throws error if the key cannot be found', () => {
    silenceErrors()
    ;(useAccounts as unknown as jest.Mock).mockReturnValue({
      key: undefined
    })
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        loading: false
      })
    )
    expect(() => render(<KeyDetailsPage id={id} />)).toThrowError(`Key with id ${id} not found`)
  })

  it('renders nothing while loading', () => {
    ;(useAccounts as unknown as jest.Mock).mockReturnValue({
      key: {
        publicKey: id,
        name: 'test'
      }
    })
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        loading: true
      })
    )
    const { container } = render(<KeyDetailsPage id={id} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the key selector, vega key indicator, title and description', () => {
    const assetId1 = '2'.repeat(64)
    ;(useAccounts as unknown as jest.Mock).mockReturnValue({
      key: {
        publicKey: id,
        name: 'test'
      },
      accountsByAsset: {
        [assetId1]: [
          {
            owner: id,
            balance: '40000000000000000000',
            asset: assetId1,
            marketId: '',
            type: 'ACCOUNT_TYPE_GENERAL'
          }
        ]
      }
    })
    ;(useAssetsStore as unknown as jest.Mock).mockReturnValue({
      loading: false
    })
    render(<KeyDetailsPage id={id} />)
    expect(screen.getByTestId('key-selector')).toBeInTheDocument()
    expect(screen.getByTestId('vega-key')).toBeInTheDocument()
    expect(screen.getByTestId(locators.keyDetailsHeading)).toHaveTextContent('Balances')
    expect(screen.getByTestId(locators.keyDetailsDescription)).toHaveTextContent(
      'Recent balance changes caused by your open positions may not be reflected below'
    )
  })

  it('renders asset card for each asset', () => {
    const assetId1 = '2'.repeat(64)
    const assetId2 = '3'.repeat(64)
    ;(useAccounts as unknown as jest.Mock).mockReturnValue({
      key: {
        publicKey: id,
        name: 'test'
      },
      accountsByAsset: {
        [assetId1]: [
          {
            owner: id,
            balance: '40000000000000000000',
            asset: assetId1,
            marketId: '',
            type: 'ACCOUNT_TYPE_GENERAL'
          }
        ],
        [assetId2]: [
          {
            owner: id,
            balance: '40000000000000000000',
            asset: assetId2,
            marketId: '',
            type: 'ACCOUNT_TYPE_GENERAL'
          }
        ]
      }
    })
    ;(useAssetsStore as unknown as jest.Mock).mockReturnValue({
      loading: false
    })
    render(<KeyDetailsPage id={id} />)
    expect(screen.getByTestId('key-selector')).toBeInTheDocument()
    expect(screen.getByTestId('vega-key')).toBeInTheDocument()
    expect(screen.getAllByTestId('asset-card')).toHaveLength(2)
  })
})
