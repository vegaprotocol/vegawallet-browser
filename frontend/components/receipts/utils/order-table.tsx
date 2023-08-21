import { ReactNode } from 'react'
import { DataTable } from '../../data-table/data-table'

export const OrderTable = ({
  marketId,
  direction,
  size,
  orderId,
  price
}: Partial<{
  marketId: string
  orderId: string
  direction: string
  size: string
  price: string
}>) => {
  const columns = [
    marketId ? ['Market', marketId] : null,
    orderId ? ['Order', orderId] : null,
    direction ? ['Direction', direction] : null,
    size ? ['Size', size] : null,
    price ? ['Price', price] : null
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]

  return <DataTable items={data} />
}
