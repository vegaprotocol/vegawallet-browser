import { vegaAccountType } from '@vegaprotocol/rest-clients/dist/trading-data'
import { AsyncRenderer } from '../../../../../components/async-renderer/async-renderer'
import { SubHeader } from '../../../../../components/sub-header'
import { VegaSection } from '../../../../../components/vega-section'
import { isActiveMarket } from '../../../../../lib/markets'
import { useAssetsStore } from '../../../../../stores/assets-store'
import { useMarketsStore } from '../../../../../stores/markets-store'
import { useAccountsStore } from './accounts-store'
import { AssetCard } from './asset-card'
import { useAccounts } from './use-accounts'
import { Notification, Intent } from '@vegaprotocol/ui-toolkit'

export const locators = {
  assetListDescription: 'asset-list-description'
}

const AssetListEmptyState = ({ publicKey }: { publicKey: string }) => {
  const { assets } = useAssetsStore((state) => ({
    assets: state.assets
  }))
  const { getMarketsByAssetId } = useMarketsStore((state) => ({
    getMarketsByAssetId: state.getMarketsByAssetId
  }))
  const sortedAssets = assets
    .map((asset) => ({
      asset,
      markets: asset?.id ? getMarketsByAssetId(asset.id).filter(isActiveMarket) : []
    }))
    .sort((a, b) => {
      return a.markets.length - b.markets.length
    })

  const top2Assets = sortedAssets.slice(0, 2)

  return (
    <div>
      <SubHeader content="Balances" />

      <p className="text-vega-dark-400 my-3">Currently you have no assets.</p>
      {top2Assets.map(({ asset }) => {
        if (!asset.id) return null
        return (
          <AssetCard
            allowZeroAccounts={true}
            key={asset.id}
            accounts={[
              {
                balance: '0',
                asset: asset.id,
                owner: publicKey,
                type: vegaAccountType.ACCOUNT_TYPE_GENERAL
              }
            ]}
            assetId={asset.id}
          />
        )
      })}
    </div>
  )
}

export const AssetsList = ({ publicKey }: { publicKey: string }) => {
  const { error } = useAccountsStore((state) => ({
    error: state.error
  }))

  const { accountsByAsset } = useAccounts(publicKey)

  return (
    <VegaSection>
      <AsyncRenderer
        loading={false}
        error={error}
        noData={Object.keys(accountsByAsset).length === 0}
        renderNoData={() => <AssetListEmptyState publicKey={publicKey} />}
        errorView={(error) => (
          <Notification
            intent={Intent.Danger}
            message={`An error occurred when loading account information: ${error.message}`}
          />
        )}
        render={() => (
          <>
            <SubHeader content="Balances" />
            <p data-testid={locators.assetListDescription} className="text-vega-dark-400 my-3">
              Recent balance changes caused by your open positions may not be reflected below
            </p>
            {Object.entries(accountsByAsset).map(([assetId, val]) => (
              <AssetCard key={assetId} accounts={val} assetId={assetId} />
            ))}
          </>
        )}
      />
    </VegaSection>
  )
}
