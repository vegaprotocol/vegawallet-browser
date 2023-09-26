import { render, screen } from '@testing-library/react'
import { AssetCard, locators } from './asset-card'
import { AccountType } from '@vegaprotocol/types'
import { useAssetsStore } from '../../../../stores/assets-store'
import { silenceErrors } from '../../../../test-helpers/silence-errors'
import { locators as dataTableLocators } from '../../../../components/data-table/data-table'

jest.mock('../../../../stores/assets-store')
jest.mock('./markets-lozenges', () => ({
  MarketLozenges: () => <div data-testid="market-lozenges" />
}))

describe('AssetCard', () => {
  it('throws error if asset details are not populated', () => {
    silenceErrors()
    const assetId = '1'.repeat(64)

    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        getAssetById: () => ({
          details: {
            decimals: undefined,
            symbol: 'foo',
            name: 'foo'
          }
        })
      })
    )
    expect(() =>
      render(
        <AssetCard
          accounts={[
            {
              balance: '1',
              asset: assetId,
              market: '2'.repeat(64),
              party: '3'.repeat(64),
              type: AccountType.ACCOUNT_TYPE_GENERAL
            }
          ]}
          assetId={assetId}
        />
      )
    ).toThrowError('Asset details not populated')
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        getAssetById: () => ({
          details: {
            decimals: 'foo',
            symbol: undefined,
            name: 'foo'
          }
        })
      })
    )
    expect(() =>
      render(
        <AssetCard
          accounts={[
            {
              balance: '1',
              asset: assetId,
              market: '2'.repeat(64),
              party: '3'.repeat(64),
              type: AccountType.ACCOUNT_TYPE_GENERAL
            }
          ]}
          assetId={assetId}
        />
      )
    ).toThrowError('Asset details not populated')
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        getAssetById: () => ({
          details: {
            decimals: 'foo',
            symbol: 'foo',
            name: undefined
          }
        })
      })
    )
    expect(() =>
      render(
        <AssetCard
          accounts={[
            {
              balance: '1',
              asset: assetId,
              market: '2'.repeat(64),
              party: '3'.repeat(64),
              type: AccountType.ACCOUNT_TYPE_GENERAL
            }
          ]}
          assetId={assetId}
        />
      )
    ).toThrowError('Asset details not populated')
  })
  it('renders header with total, symbol, name and market lozenges', () => {
    const assetId = '1'.repeat(64)
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        getAssetById: () => ({
          details: {
            decimals: '5',
            symbol: 'Foo',
            name: 'Foobarbaz'
          }
        })
      })
    )
    render(
      <AssetCard
        accounts={[
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
        ]}
        assetId={assetId}
      />
    )
    expect(screen.getByTestId(locators.assetHeaderName)).toHaveTextContent('Foobarbaz')
    expect(screen.getByTestId(locators.assetHeaderSymbol)).toHaveTextContent('Foo')
    expect(screen.getByTestId(locators.assetHeaderTotal)).toHaveTextContent('0.00003')
    expect(screen.getByTestId('market-lozenges')).toBeInTheDocument()
  })
  it('renders table with each account', () => {
    const assetId = '1'.repeat(64)
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        getAssetById: () => ({
          details: {
            decimals: '5',
            symbol: 'Foo',
            name: 'Foobarbaz'
          }
        })
      })
    )
    render(
      <AssetCard
        accounts={[
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
        ]}
        assetId={assetId}
      />
    )
    const rows = screen.getAllByTestId(dataTableLocators.dataRow)
    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent('General')
    expect(rows[0]).toHaveTextContent('0.00001')
    expect(rows[1]).toHaveTextContent('Fees (maker)')
    expect(rows[1]).toHaveTextContent('0.00002')
  })
})
