import { ReactNode } from 'react'
import { DataTable } from '../../data-table/data-table'
import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { OrderType, Side } from '@vegaprotocol/types'
import { MarketLink } from './order/market-link'
import { Direction } from './order/side'
import { OrderTypeComponent } from './order/order-type'

export const OrderTable = ({
  marketId,
  side,
  orderId,
  reference,
  type
}: Partial<{
  marketId: string
  orderId: string
  side: Side
  size: string
  price: string
  reference: string
  type: OrderType
}>) => {
  const columns = [
    marketId ? ['Market', <MarketLink key="order-details-market" marketId={marketId} />] : null,
    orderId ? ['Order', truncateMiddle(orderId)] : null,
    side ? ['Direction', <Direction key="order-details-direction" side={side} />] : null,
    type ? ['Type', <OrderTypeComponent key="order-details-type" type={type} />] : null,
    reference ? ['Reference', reference] : null
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]

  return <DataTable items={data} />
}
