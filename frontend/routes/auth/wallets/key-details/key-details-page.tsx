import { VegaKey } from '../../../../components/keys/vega-key'
import { VegaSection } from '../../../../components/vega-section'
import { useAssetsStore } from '../../../../stores/assets-store'
import { AssetCard } from './asset-card'
import { KeySelector } from './key-selector'
import { useAccounts } from './use-accounts'

export const locators = {
  keyDetailsHeading: 'key-details-heading',
  keyDetailsDescription: 'key-details-description'
}

export const KeyDetailsPage = ({ id }: { id: string }) => {
  const { accountsByAsset, key } = useAccounts(id)
  const { loading } = useAssetsStore((state) => ({
    loading: state.loading
  }))
  if (!key) throw new Error(`Key with id ${id} not found`)
  if (loading) return null

  return (
    <div>
      <section>
        <div className="mb-6">
          <KeySelector currentKey={key} />
        </div>
        <VegaKey publicKey={key.publicKey} />
      </section>
      <VegaSection>
        <h1 data-testid={locators.keyDetailsHeading} className="text-vega-dark-300 text-sm uppercase">
          Balances
        </h1>
        <p data-testid={locators.keyDetailsDescription} className="text-vega-dark-400 my-3">
          Recent balance changes caused by your open positions may not be reflected below
        </p>
        {Object.entries(accountsByAsset).map(([assetId, val]) => (
          <AssetCard key={assetId} accounts={val} assetId={assetId} />
        ))}
      </VegaSection>
    </div>
  )
}
