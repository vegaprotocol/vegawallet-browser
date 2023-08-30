import { ReactNode } from 'react'
import { DataTable } from '../../data-table/data-table'
import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { OrderType, Side } from '@vegaprotocol/types'
import { MarketLink } from './order/market-link'
import { Direction } from './order/direction'
import { OrderTypeComponent } from './order/order-type'

export const OrderTable = ({
  marketId,
  direction,
  orderId,
  reference,
  type
}: Partial<{
  marketId: string
  orderId: string
  direction: Side
  size: string
  price: string
  reference: string
  type: OrderType
}>) => {
  const columns = [
    marketId ? ['Market', <MarketLink key="order-details-market" marketId={marketId} />] : null,
    orderId ? ['Order', truncateMiddle(orderId)] : null,
    direction ? ['Direction', <Direction key="order-details-direction" direction={direction} />] : null,
    type ? ['Type', <OrderTypeComponent key="order-details-type" type={type} />] : null,
    reference ? ['Reference', reference] : null
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]

  return <DataTable items={data} />
}
