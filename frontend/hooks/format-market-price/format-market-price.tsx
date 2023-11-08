import get from 'lodash/get'
import { useMarketsStore } from '../../stores/markets-store'
import { formatNumber, toBigNum } from '@vegaprotocol/utils'

export const useMarketPrice = (marketId: string, price: string) => {
  const { loading, getMarketById } = useMarketsStore((state) => ({
    loading: state.loading,
    getMarketById: state.getMarketById
  }))
  if (loading) return null
  const market = getMarketById(marketId)
  const marketDecimal = Number(get(market, 'marketDecimals'))
  if (!market || !marketDecimal) throw new Error('Could not find market or marketDecimals')
  return formatNumber(toBigNum(price, marketDecimal), marketDecimal)
}
