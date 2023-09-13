import { ReactNode } from 'react'
import { DataTable } from '../../data-table/data-table'
import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { OrderType, Side, PeggedOrder } from '@vegaprotocol/types'
import { MarketLink } from './order/market-link'
import { Direction } from './order/direction'
import { OrderTypeComponent } from './order/order-type'
import { PeggedOrderInfo } from './order/pegged-order-info.tsx'
import { PriceWithTooltip } from './string-amounts/price-with-tooltip'
import { SizeWithTooltip } from './string-amounts/size-with-tooltip'

export const OrderTable = ({
  marketId,
  direction,
  orderId,
  reference,
  price,
  size,
  type,
  peggedOrder
}: Partial<{
  marketId: string
  orderId: string
  direction: Side
  size: string
  price: string
  reference: string
  type: OrderType
  peggedOrder?: PeggedOrder
}>) => {
  const columns = [
    price && price !== '0' && marketId
      ? ['Price', <PriceWithTooltip key="order-details-price" marketId={marketId} price={price} />]
      : null,
    peggedOrder && marketId
      ? ['Pegged price', <PeggedOrderInfo key="order-details-pegged" peggedOrder={peggedOrder} marketId={marketId} />]
      : null,
    size && marketId ? ['Size', <SizeWithTooltip key="order-details-price" marketId={marketId} size={size} />] : null,
    marketId ? ['Market', <MarketLink key="order-details-market" marketId={marketId} />] : null,
    orderId ? ['Order', truncateMiddle(orderId)] : null,
    direction ? ['Direction', <Direction key="order-details-direction" direction={direction} />] : null,
    type ? ['Type', <OrderTypeComponent key="order-details-type" type={type} />] : null,
    reference ? ['Reference', reference] : null
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]

  return <DataTable items={data} />
}
