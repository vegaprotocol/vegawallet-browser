import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import get from 'lodash/get'

import { useMarket } from '../use-market'

export const useFormatMarketPrice = (marketId?: string, price?: string) => {
  const market = useMarket(marketId)
  if (!market || !price) return
  const marketDecimal = Number(get(market, 'decimalPlaces'))
  if (!marketDecimal) throw new Error('Could not find market or decimalPlaces')
  return formatNumber(toBigNum(price, marketDecimal), marketDecimal)
}
