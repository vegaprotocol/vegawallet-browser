import { vegaMarket, vegaPeggedReference } from '@vegaprotocol/rest-clients/dist/trading-data'
import { PriceWithTooltip } from '../string-amounts/price-with-tooltip'
import { AmountWithSymbol } from '../string-amounts/amount-with-symbol'
import { PeggedOrderOptions } from '../../../../types/transactions'
import { useFormatMarketPrice } from '../../../../hooks/format-market-price'

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
  const formattedOffset = useFormatMarketPrice(marketId, offset)

  const priceToDisplay = formattedOffset ? (
    <AmountWithSymbol amount={formattedOffset} symbol={symbol} />
  ) : (
    <PriceWithTooltip price={offset} marketId={marketId} />
  )

  return (
    <span className="flex items-center">
      {priceToDisplay}
      <span className="pl-1 text-vega-dark-400">from {referenceText[reference]}</span>
    </span>
  )
}
