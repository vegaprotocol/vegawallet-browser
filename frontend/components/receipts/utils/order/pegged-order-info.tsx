import { PriceWithTooltip } from '../string-amounts/price-with-tooltip.tsx'
import { PeggedOrder, PeggedReference } from '@vegaprotocol/types'

export const referenceText: Record<PeggedReference, string> = {
  PEGGED_REFERENCE_BEST_ASK: 'best ask',
  PEGGED_REFERENCE_BEST_BID: 'best bid',
  PEGGED_REFERENCE_MID: 'mid'
}

interface PeggedOrderInfoProps {
  peggedOrder: PeggedOrder
  marketId: string
}

export const PeggedOrderInfo = ({ peggedOrder, marketId }: PeggedOrderInfoProps) => {
  const { offset, reference } = peggedOrder

  return (
    <span className="flex items-center">
      <PriceWithTooltip price={offset} marketId={marketId} />{' '}
      <span className="pl-1 text-vega-dark-400">from {referenceText[reference]}</span>
    </span>
  )
}
