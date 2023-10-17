import { ExternalLink, Lozenge } from '@vegaprotocol/ui-toolkit'
import { useMarketsStore } from '../../../../../stores/markets-store'
import config from '!/config'
import get from 'lodash/get'
import { isActiveMarket } from '../../../../../lib/markets'

export const locators = {
  marketsDescription: 'markets-description',
  marketLozenge: 'market-lozenge'
}

export const MarketLozenges = ({ assetId }: { assetId: string }) => {
  const { getMarketsByAssetId } = useMarketsStore((state) => ({
    getMarketsByAssetId: state.getMarketsByAssetId
  }))
  const markets = getMarketsByAssetId(assetId)
  const activeMarkets = markets.filter(isActiveMarket)

  const top5Markets = activeMarkets.slice(0, 5)
  if (top5Markets.length === 0) return null
  return (
    <div className="text-left">
      <p className="mb-1 text-sm" data-testid={locators.marketsDescription}>
        Currently traded in:
      </p>
      <div className="flex gap-x-2 gap-y-3 flex-wrap">
        {top5Markets.map((m) => (
          <ExternalLink
            className="text-xs"
            data-testid={locators.marketLozenge}
            href={`${config.network.console}/#/markets/${m.id}`}
            key={m.id}
          >
            <Lozenge>{get(m, 'tradableInstrument.instrument.code')}</Lozenge>
          </ExternalLink>
        ))}
      </div>
    </div>
  )
}
