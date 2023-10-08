import { SubHeader } from '../../../../../components/sub-header'
import { VegaSection } from '../../../../../components/vega-section'
import { AssetCard } from './asset-card'
import { useAccounts } from './use-accounts'

export const locators = {
  assetListDescription: 'asset-list-description'
}

export const AssetsList = ({ id }: { id: string }) => {
  const { accountsByAsset } = useAccounts(id)
  return (
    <VegaSection>
      <SubHeader content="Balances" />
      <p data-testid={locators.assetListDescription} className="text-vega-dark-400 my-3">
        Recent balance changes caused by your open positions may not be reflected below
      </p>
      {Object.entries(accountsByAsset).map(([assetId, val]) => (
        <AssetCard key={assetId} accounts={val} assetId={assetId} />
      ))}
    </VegaSection>
  )
}
