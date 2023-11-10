import get from 'lodash/get'
import { useMarketsStore } from '../../stores/markets-store'
import { formatNumber, toBigNum } from '@vegaprotocol/utils'

// TODO make marketid and price non-optional
export const useFormatMarketPrice = (marketId?: string, price?: string) => {
  const { loading, getMarketById } = useMarketsStore((state) => ({
    loading: state.loading,
    getMarketById: state.getMarketById
  }))
  if (loading || !marketId || !price) return undefined
  const market = getMarketById(marketId)
  const marketDecimal = Number(get(market, 'marketDecimals'))
  if (!market || !marketDecimal) throw new Error('Could not find market or marketDecimals')
  return formatNumber(toBigNum(price, marketDecimal), marketDecimal)
}
