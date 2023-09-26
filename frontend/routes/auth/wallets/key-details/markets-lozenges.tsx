import { Lozenge } from '@vegaprotocol/ui-toolkit'
import { useMarketsStore } from '../../../../stores/markets-store'

export const CurrentMarkets = ({ assetId }: { assetId: string }) => {
  const { getMarketsByAssetId } = useMarketsStore((state) => ({
    getMarketsByAssetId: state.getMarketsByAssetId
  }))
  const markets = getMarketsByAssetId(assetId)

  const top5Markets = markets.slice(0, 5)
  if (top5Markets.length === 0) return null
  return (
    <div className="text-left">
      <p className="mb-1 text-sm">Currently traded in:</p>
      {top5Markets.map((m) => (
        <span key={m.id} className="text-xs">
          <Lozenge>{m.tradableInstrument?.instrument?.name}</Lozenge>
        </span>
      ))}
    </div>
  )
}
