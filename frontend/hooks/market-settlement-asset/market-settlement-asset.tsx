import { getSettlementAssetId } from '../../lib/markets'
import { useAssetsStore } from '../../stores/assets-store'
import { useMarketsStore } from '../../stores/markets-store'

export const useMarketSettlementAsset = (marketId?: string) => {
  const { getMarketById, loading: marketsLoading } = useMarketsStore((state) => ({
    getMarketById: state.getMarketById,
    loading: state.loading
  }))
  const { loading: assetsLoading, getAssetById } = useAssetsStore((state) => ({
    loading: state.loading,
    getAssetById: state.getAssetById
  }))
  if (assetsLoading || marketsLoading || !marketId) return undefined
  const market = getMarketById(marketId)
  const settlementAssetId = getSettlementAssetId(market)
  return getAssetById(settlementAssetId)
}
