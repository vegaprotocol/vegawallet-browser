import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { ReceiptComponentProps } from '../../receipts'
import { MarketLink } from '../../utils/order/market-link'
import { ReactNode } from 'react'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'
import { DataTable } from '../../../data-table/data-table'

export const StopOrderCancellation = ({ transaction }: ReceiptComponentProps) => {
  const { marketId, stopOrderId } = transaction.stopOrdersCancellation
  const columns = [
    marketId ? ['Market', <MarketLink key="order-details-market" marketId={marketId} />] : null,
    stopOrderId ? ['Stop Order', truncateMiddle(stopOrderId)] : null
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]

  return (
    <ReceiptWrapper>
      <DataTable items={data} />
    </ReceiptWrapper>
  )
}
