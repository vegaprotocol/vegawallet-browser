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

export const AssetsList = ({ id }: { id: string }) => {
  const { error } = useAccountsStore((state) => ({
    error: state.error
  }))

  const { accountsByAsset } = useAccounts(id)

  return (
    <VegaSection>
      <AsyncRenderer
        loading={false}
        error={error}
        noData={false}
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
