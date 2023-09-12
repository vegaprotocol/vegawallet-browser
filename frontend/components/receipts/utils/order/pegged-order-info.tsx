import { PriceWithTooltip } from '../string-amounts/price-with-tooltip.tsx'
import { PeggedOrder } from '@vegaprotocol/types'

interface PeggedOrderInfoProps {
  peggedOrder: PeggedOrder
  marketId: string
}

export const PeggedOrderInfo = ({ peggedOrder, marketId }: PeggedOrderInfoProps) => {
  const { offset, reference } = peggedOrder
  const formattedReference = reference.toLowerCase().replace('pegged_reference_', '').replace('_', ' ')

  return (
    <span className="flex items-center">
      <PriceWithTooltip price={offset} marketId={marketId} />{' '}
      <span className="pl-1 text-vega-dark-400">from {formattedReference}</span>
    </span>
  )
}
