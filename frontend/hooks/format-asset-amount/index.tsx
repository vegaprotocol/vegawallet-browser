import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { useAssetsStore } from '../../stores/assets-store'

export const useFormatAssetAmount = (assetId: string, amount: string) => {
  const { getAssetById } = useAssetsStore((state) => ({
    getAssetById: state.getAssetById
  }))
  const assetInfo = getAssetById(assetId)
  const decimals = Number(assetInfo?.details?.decimals)
  const symbol = assetInfo?.details?.symbol
  if (!symbol || !decimals)
    throw new Error(`Could not find amount, decimals or symbol when trying to render transaction for asset ${assetId}`)
  const formattedAmount = formatNumber(toBigNum(amount, decimals), decimals)
  return { amount, formattedAmount, symbol, assetInfo }
}
