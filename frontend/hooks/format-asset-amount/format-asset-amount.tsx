import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { useAssetsStore } from '../../stores/assets-store'
import get from 'lodash/get'

export const useFormatAssetAmount = (assetId: string, amount: string) => {
  const { getAssetById, loading } = useAssetsStore((state) => ({
    getAssetById: state.getAssetById,
    loading: state.loading
  }))
  if (loading) return null
  const assetInfo = getAssetById(assetId)
  const decimals = Number(get(assetInfo, 'details.decimals'))
  const symbol = get(assetInfo, 'details.symbol')
  if (!symbol || !decimals)
    throw new Error(`Could not find amount, decimals or symbol when trying to render transaction for asset ${assetId}`)
  const formattedAmount = formatNumber(toBigNum(amount, decimals), decimals)
  return { formattedAmount, symbol }
}
