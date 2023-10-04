import { PriceWithTooltip } from '../string-amounts/price-with-tooltip'
import { PeggedOrder, PeggedReference } from '@vegaprotocol/types'
import { PriceWithSymbol } from '../string-amounts/price-with-symbol'
import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { VegaMarket } from '../../../../types/rest-api'

export const referenceText: Record<PeggedReference, string> = {
  PEGGED_REFERENCE_BEST_ASK: 'best ask',
  PEGGED_REFERENCE_BEST_BID: 'best bid',
  PEGGED_REFERENCE_MID: 'mid'
}

interface PeggedOrderInfoProps {
  marketsLoading: boolean
  peggedOrder: PeggedOrder
  market?: VegaMarket
  marketId: string
  symbol?: string
}

export const PeggedOrderInfo = ({ marketsLoading, peggedOrder, market, marketId, symbol }: PeggedOrderInfoProps) => {
  const { offset, reference } = peggedOrder
  let formattedOffset: string | number = offset

  if (market && market.decimalPlaces) {
    const marketDecimals = Number(market.decimalPlaces)
    formattedOffset = formatNumber(toBigNum(offset, marketDecimals), marketDecimals)
  }

  const priceToDisplay =
    marketsLoading || !market ? (
      <PriceWithTooltip price={offset} marketId={marketId} />
    ) : (
      <PriceWithSymbol price={formattedOffset} symbol={symbol} />
    )

  return (
    <span className="flex items-center">
      {priceToDisplay}
      <span className="pl-1 text-vega-dark-400">from {referenceText[reference]}</span>
    </span>
  )
}
