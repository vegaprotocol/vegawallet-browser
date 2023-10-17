import { vegaMarket } from '@vegaprotocol/rest-clients/dist/trading-data'
import get from 'lodash/get'

export const getSettlementAssetId = (market: vegaMarket) => {
  const assetId =
    get(market, 'tradableInstrument.instrument.future.settlementAsset') ??
    get(market, 'tradableInstrument.instrument.perpetual.settlementAsset')
  if (!assetId) {
    throw new Error(`Could not find settlement asset from market ${market.id}`)
  }
  return assetId
}
