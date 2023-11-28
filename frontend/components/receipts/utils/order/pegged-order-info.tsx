import { vegaPeggedReference } from '@vegaprotocol/rest-clients/dist/trading-data'
import get from 'lodash/get'

import { useFormatMarketPrice } from '../../../../hooks/format-market-price'
import { useMarketSettlementAsset } from '../../../../hooks/market-settlement-asset'
import { PeggedOrderOptions } from '../../../../types/transactions'
import { AmountWithSymbol } from '../string-amounts/amount-with-symbol'
import { PriceWithTooltip } from '../string-amounts/price-with-tooltip'

export const referenceText: Record<vegaPeggedReference, string> = {
  [vegaPeggedReference.PEGGED_REFERENCE_BEST_ASK]: 'best ask',
  [vegaPeggedReference.PEGGED_REFERENCE_BEST_BID]: 'best bid',
  [vegaPeggedReference.PEGGED_REFERENCE_MID]: 'mid',
  [vegaPeggedReference.PEGGED_REFERENCE_UNSPECIFIED]: 'unspecified'
}

interface PeggedOrderInfoProperties {
  peggedOrder: PeggedOrderOptions
  marketId: string
}

export const PeggedOrderInfo = ({ peggedOrder, marketId }: PeggedOrderInfoProperties) => {
  const { offset, reference } = peggedOrder
  const formattedOffset = useFormatMarketPrice(marketId, offset)
  const settlementAsset = useMarketSettlementAsset(marketId)
  const symbol = get(settlementAsset, 'details.symbol')

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
