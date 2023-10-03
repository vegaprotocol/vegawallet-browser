import { NavLink } from 'react-router-dom'
import { ArrowLeft } from '../../../../components/icons/arrow-left'
import { VegaKey } from '../../../../components/keys/vega-key'
import { VegaSection } from '../../../../components/vega-section'
import { useAssetsStore } from '../../../../stores/assets-store'
import { useWalletStore } from '../../../../stores/wallets'
import { FULL_ROUTES } from '../../../route-names'
import { AssetCard } from './asset-card'
import { KeySelector } from './key-selector'
import { useAccounts } from './use-accounts'
import { SubHeader } from '../../../../components/sub-header'

export const locators = {
  keyDetailsHeading: 'key-details-heading',
  keyDetailsDescription: 'key-details-description',
  keyDetailsBack: 'key-details-back'
}

export const KeyDetailsPage = ({ id }: { id: string }) => {
  const { accountsByAsset, key } = useAccounts(id)
  const { loading } = useAssetsStore((state) => ({
    loading: state.loading
  }))
  const { loading: walletsLoading } = useWalletStore((state) => ({
    loading: state.loading
  }))
  if (loading || walletsLoading) return null
  if (!key) throw new Error(`Key with id ${id} not found`)

  return (
    <div>
      <section>
        <div className="mb-6 flex items-center text-white">
          <NavLink
            data-testid={locators.keyDetailsBack}
            to={{ pathname: FULL_ROUTES.wallets }}
            className="mr-4 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </NavLink>
          <KeySelector currentKey={key} />
        </div>
        <VegaKey publicKey={key.publicKey} />
      </section>
      <VegaSection>
        <SubHeader content="Balances" />
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
