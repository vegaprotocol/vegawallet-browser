import { useAssetsStore } from '../../../../stores/assets-store'
import { AssetCard } from './asset-card'
import { useAccounts } from './use-accounts'

export const KeyDetails = () => {
  const id = '3f06a87a08980897ccb244c9f7e559fb23f025c1366cf64926ccf3e8d4ab9cc2'
  const { accountsByAsset, key } = useAccounts(id)
  const { loading } = useAssetsStore((state) => ({
    loading: state.loading
  }))
  if (!id) throw new Error('Id not found')
  if (loading) return null

  return (
    <div>
      <h1>{key?.name ?? 'Unknown key'}</h1>
      {Object.entries(accountsByAsset).map(([assetId, val]) => (
        <AssetCard key={assetId} accounts={val} assetId={assetId} />
      ))}
    </div>
  )
}
