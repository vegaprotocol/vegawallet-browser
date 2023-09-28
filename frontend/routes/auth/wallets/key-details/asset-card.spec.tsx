import { render, screen } from '@testing-library/react'
import { AssetCard, locators } from './asset-card'
import { AccountType } from '@vegaprotocol/types'
import { useAssetsStore } from '../../../../stores/assets-store'
import { silenceErrors } from '../../../../test-helpers/silence-errors'
import { locators as dataTableLocators } from '../../../../components/data-table/data-table'
import { Apiv1Account, VegaAsset } from '../../../../types/rest-api'

const assetId = '1'.repeat(64)

jest.mock('../../../../stores/assets-store')
jest.mock('./markets-lozenges', () => ({
  MarketLozenges: () => <div data-testid="market-lozenges" />
}))

const renderComponent = (assetInfo: VegaAsset | undefined, accounts: Apiv1Account[]) => {
  ;(useAssetsStore as unknown as jest.Mock).mockImplementation((fn) =>
    fn({
      getAssetById: () => assetInfo
    })
  )
  render(<AssetCard accounts={accounts} assetId={assetId} />)
}

describe('AssetCard', () => {
  it('throws error if asset details are not populated', () => {
    silenceErrors()
    const account = {
      balance: '1',
      asset: assetId,
      market: '2'.repeat(64),
      party: '3'.repeat(64),
      type: AccountType.ACCOUNT_TYPE_GENERAL
    }
    expect(() =>
      renderComponent(
        {
          details: {
            decimals: undefined,
            symbol: 'foo',
            name: 'foo'
          }
        },
        [account]
      )
    ).toThrowError('Asset details not populated')

    expect(() =>
      renderComponent(
        {
          details: {
            decimals: 'foo',
            symbol: undefined,
            name: 'foo'
          }
        },
        [account]
      )
    ).toThrowError('Asset details not populated')

    expect(() =>
      renderComponent(
        {
          details: {
            decimals: 'foo',
            symbol: 'foo',
            name: undefined
          }
        },
        [account]
      )
    ).toThrowError('Asset details not populated')
  })
  it('renders header with total, symbol, name and market lozenges', () => {
    renderComponent(
      {
        details: {
          decimals: '5',
          symbol: 'Foo',
          name: 'Foobarbaz'
        }
      },
      [
        {
          balance: '1',
          asset: assetId,
          market: '2'.repeat(64),
          party: '3'.repeat(64),
          type: AccountType.ACCOUNT_TYPE_GENERAL
        },
        {
          balance: '2',
          asset: assetId,
          market: '2'.repeat(64),
          party: '3'.repeat(64),
          type: AccountType.ACCOUNT_TYPE_FEES_MAKER
        }
      ]
    )

    expect(screen.getByTestId(locators.assetHeaderName)).toHaveTextContent('Foobarbaz')
    expect(screen.getByTestId(locators.assetHeaderSymbol)).toHaveTextContent('Foo')
    expect(screen.getByTestId(locators.assetHeaderTotal)).toHaveTextContent('0.00003')
    expect(screen.getByTestId('market-lozenges')).toBeInTheDocument()
  })
  it('renders table with each account', () => {
    renderComponent(
      {
        details: {
          decimals: '5',
          symbol: 'Foo',
          name: 'Foobarbaz'
        }
      },
      [
        {
          balance: '1',
          asset: assetId,
          market: '2'.repeat(64),
          party: '3'.repeat(64),
          type: AccountType.ACCOUNT_TYPE_GENERAL
        },
        {
          balance: '2',
          asset: assetId,
          market: '2'.repeat(64),
          party: '3'.repeat(64),
          type: AccountType.ACCOUNT_TYPE_FEES_MAKER
        }
      ]
    )
    const rows = screen.getAllByTestId(dataTableLocators.dataRow)
    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent('General')
    expect(rows[0]).toHaveTextContent('0.00001')
    expect(rows[1]).toHaveTextContent('Fees (maker)')
    expect(rows[1]).toHaveTextContent('0.00002')
  })
})
