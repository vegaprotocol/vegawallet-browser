import { render, screen } from '@testing-library/react'
import { AssetsList, locators } from './assets-list'
import { locators as subHeaderLocators } from '../../../../../components/sub-header'
import { useAccounts } from './use-accounts'

jest.mock('./use-accounts')

jest.mock('./asset-card', () => ({
  AssetCard: () => <div data-testid="asset-card" />
}))

const ASSET_ID_1 = '1'.repeat(64)
const ASSET_ID_2 = '2'.repeat(64)
const ID = '3'.repeat(64)

describe('AssetsList', () => {
  it('renders title, description and a card for each asset', () => {
    ;(useAccounts as unknown as jest.Mock).mockReturnValue({
      key: {
        publicKey: ID,
        name: 'test'
      },
      accountsByAsset: {
        [ASSET_ID_1]: [
          {
            owner: ID,
            balance: '40000000000000000000',
            asset: ASSET_ID_1,
            marketId: '',
            type: 'ACCOUNT_TYPE_GENERAL'
          }
        ],
        [ASSET_ID_2]: [
          {
            owner: ID,
            balance: '40000000000000000000',
            asset: ASSET_ID_2,
            marketId: '',
            type: 'ACCOUNT_TYPE_GENERAL'
          }
        ]
      }
    })
    render(<AssetsList id={'123'} />)
    expect(screen.getByTestId(subHeaderLocators.subHeader)).toHaveTextContent('Balances')
    expect(screen.getByTestId(locators.assetListDescription)).toHaveTextContent(
      'Recent balance changes caused by your open positions may not be reflected below'
    )
    expect(screen.getAllByTestId('asset-card')).toHaveLength(2)
  })
})
