import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { ReactNode } from 'react'

import { DataTable } from '../../../data-table'
import { MarketLink } from '../../../vega-entities/market-link'
import { ReceiptComponentProperties } from '../../receipts'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'

export const StopOrderCancellationView = ({ stopOrdersCancellation }: { stopOrdersCancellation: any }) => {
  const { marketId, stopOrderId } = stopOrdersCancellation
  const columns = [
    marketId ? ['Market', <MarketLink key="order-details-market" marketId={marketId} />] : null,
    stopOrderId ? ['Stop Order', truncateMiddle(stopOrderId)] : null
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]
  return <DataTable items={data} />
}

export const StopOrderCancellation = ({ transaction }: ReceiptComponentProperties) => {
  const { stopOrdersCancellation } = transaction

  return (
    <ReceiptWrapper>
      <StopOrderCancellationView stopOrdersCancellation={stopOrdersCancellation} />
    </ReceiptWrapper>
  )
}
