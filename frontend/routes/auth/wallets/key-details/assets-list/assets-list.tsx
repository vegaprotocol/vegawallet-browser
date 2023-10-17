import { AsyncRenderer } from '../../../../../components/async-renderer/async-renderer'
import { SubHeader } from '../../../../../components/sub-header'
import { VegaSection } from '../../../../../components/vega-section'
import { useAccountsStore } from './accounts-store'
import { AssetCard } from './asset-card'
import { useAccounts } from './use-accounts'
import { Notification, Intent } from '@vegaprotocol/ui-toolkit'

export const locators = {
  assetListDescription: 'asset-list-description'
}

const AssetListEmptyState = ({ publicKey }: { publicKey: string }) => {
  return <div>Currently you have no assets.</div>
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
