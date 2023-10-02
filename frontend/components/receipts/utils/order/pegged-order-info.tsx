import { vegaPeggedReference } from '@vegaprotocol/rest-clients/dist/trading-data'
import { PriceWithTooltip } from '../string-amounts/price-with-tooltip'
import { PeggedOrderOptions } from '../../../../types/transactions'

export const referenceText: Record<vegaPeggedReference, string> = {
  [vegaPeggedReference.PEGGED_REFERENCE_BEST_ASK]: 'best ask',
  [vegaPeggedReference.PEGGED_REFERENCE_BEST_BID]: 'best bid',
  [vegaPeggedReference.PEGGED_REFERENCE_MID]: 'mid',
  [vegaPeggedReference.PEGGED_REFERENCE_UNSPECIFIED]: 'unspecified'
}

interface PeggedOrderInfoProps {
  peggedOrder: PeggedOrderOptions
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
