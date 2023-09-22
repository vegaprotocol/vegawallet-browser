import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@vegaprotocol/ui-toolkit'
import { VegaKey } from '../../../../components/keys/vega-key'
import { VegaSection } from '../../../../components/vega-section'
import { useAssetsStore } from '../../../../stores/assets-store'
import { AssetCard } from './asset-card'
import { useAccounts } from './use-accounts'
import { IconChevronDown } from '../../../../components/icons/chevron-down'
import { useWalletStore } from '../../../../stores/wallets'
import { NavLink } from 'react-router-dom'
import { FULL_ROUTES } from '../../../route-names'

export const KeyDetails = () => {
  const id = '3f06a87a08980897ccb244c9f7e559fb23f025c1366cf64926ccf3e8d4ab9cc2'
  const { accountsByAsset, key } = useAccounts(id)
  const { keys } = useWalletStore((state) => ({
    keys: state.wallets.flatMap((w) => w.keys)
  }))
  const { loading } = useAssetsStore((state) => ({
    loading: state.loading
  }))
  if (!id) throw new Error('Id not found')
  if (loading || !key) return null

  return (
    <div>
      <section>
        <div className="mb-6">
          <DropdownMenu
            modal={false}
            trigger={
              <DropdownMenuTrigger className="text-white">
                <div className="flex items-center">
                  <span className="mr-1 text-2xl">{key.name ?? 'Unknown key'}</span> <IconChevronDown size={16} />
                </div>
              </DropdownMenuTrigger>
            }
          >
            <DropdownMenuContent style={{ overflow: 'hidden', overflowY: 'auto', maxHeight: 360 }}>
              <div className="m-4">
                <h1 className="text-vega-dark-300 text-sm uppercase">Keys</h1>
                {keys.map((k) => (
                  <div className="my-3 text-base" key={k.publicKey}>
                    <NavLink to={{ pathname: `${FULL_ROUTES.wallets}/${k.publicKey}` }}>
                      <VegaKey publicKey={k.publicKey} name={k.name} />
                    </NavLink>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <VegaKey publicKey={key.publicKey} />
      </section>
      <VegaSection>
        <h1 className="text-vega-dark-300 text-sm uppercase">Funds</h1>
        <p className="text-vega-dark-400 my-3">If you have open positions, funds totals below may differ.</p>
        {Object.entries(accountsByAsset).map(([assetId, val]) => (
          <AssetCard key={assetId} accounts={val} assetId={assetId} />
        ))}
      </VegaSection>
    </div>
  )
}
