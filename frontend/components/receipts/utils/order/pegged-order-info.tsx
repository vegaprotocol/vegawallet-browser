import { PriceWithTooltip } from '../string-amounts/price-with-tooltip'
import { vegaPeggedReference } from '@vegaprotocol/rest-clients/dist/trading-data'
import { PriceWithSymbol } from '../string-amounts/price-with-symbol'
import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { PeggedOrderOptions } from '../../../../types/transactions'

export const referenceText: Record<vegaPeggedReference, string> = {
  [vegaPeggedReference.PEGGED_REFERENCE_BEST_ASK]: 'best ask',
  [vegaPeggedReference.PEGGED_REFERENCE_BEST_BID]: 'best bid',
  [vegaPeggedReference.PEGGED_REFERENCE_MID]: 'mid',
  [vegaPeggedReference.PEGGED_REFERENCE_UNSPECIFIED]: 'unspecified'
}

interface PeggedOrderInfoProps {
  marketsLoading: boolean
  peggedOrder: PeggedOrderOptions
  market?: vegaMarket
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
