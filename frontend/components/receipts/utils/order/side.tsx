import type { Side as vegaSide } from '@vegaprotocol/enums'

import { DERIVATIVE_SIDE_MAP, processSide, SPOT_SIDE_MAP } from '@/lib/enums'
import { isSpotMarket } from '@/lib/markets'
import { useMarketsStore } from '@/stores/markets-store'

export const DerivativeSide = ({ side }: { side: vegaSide }) => {
  const sideValue = processSide(side)
  return <>{DERIVATIVE_SIDE_MAP[sideValue]}</>
}

export const SpotSide = ({ side }: { side: vegaSide }) => {
  const sideValue = processSide(side)
  return <>{SPOT_SIDE_MAP[sideValue]}</>
}

export const OrderSide = ({ side, marketId }: { side: vegaSide; marketId: string }) => {
  const { loading, getMarketById } = useMarketsStore((state) => ({
    loading: state.loading,
    getMarketById: state.getMarketById
  }))
  const market = getMarketById(marketId)
  if (loading || !market) return <DerivativeSide side={side} />
  const isSpot = isSpotMarket(market)
  return <>{isSpot ? <SpotSide side={side} /> : <DerivativeSide side={side} />}</>
}
