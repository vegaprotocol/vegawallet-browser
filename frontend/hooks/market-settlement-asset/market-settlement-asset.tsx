import { getMarketPriceAssetId } from '@/lib/markets'
import { useAssetsStore } from '@/stores/assets-store'
import { useMarketsStore } from '@/stores/markets-store'

export const useMarketPriceAsset = (marketId?: string) => {
  const { getMarketById, loading: marketsLoading } = useMarketsStore((state) => ({
    getMarketById: state.getMarketById,
    loading: state.loading
  }))
  const { loading: assetsLoading, getAssetById } = useAssetsStore((state) => ({
    loading: state.loading,
    getAssetById: state.getAssetById
  }))
  if (assetsLoading || marketsLoading || !marketId) return
  const market = getMarketById(marketId)
  const settlementAssetId = getMarketPriceAssetId(market)
  return getAssetById(settlementAssetId)
}
