import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import get from 'lodash/get'

import { HALF_MAX_POSITION_SIZE } from '@/lib/transactions'

import { useMarket } from '../use-market'

export const useFormatSizeAmount = (marketId?: string, size?: string) => {
  const market = useMarket(marketId)
  if (!market || !size) return
  if (size === HALF_MAX_POSITION_SIZE) return 'Max'
  const positionDecimals = Number(get(market, 'positionDecimalPlaces'))
  const noPositionDecimals = !positionDecimals && positionDecimals !== 0

  if (noPositionDecimals) throw new Error('Could not find market or positionDecimals')
  return formatNumber(toBigNum(size, positionDecimals), positionDecimals)
}
