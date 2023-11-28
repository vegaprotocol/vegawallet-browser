import { vegaOrderStatus, vegaOrderType, vegaSide } from '@vegaprotocol/rest-clients/dist/trading-data'
import { ReactNode } from 'react'

import { PeggedOrderOptions } from '@/types/transactions'
import { DataTable } from '../../data-table/data-table'
import {
  buildCreatedAtColumn,
  buildMarketColumn,
  buildOrderColumn,
  buildPeggedOrderColumn,
  buildPriceColumn,
  buildReferenceColumn,
  buildRemainingColumn,
  buildSideColumn,
  buildSizeColumn,
  buildStatusColumn,
  buildTypeColumn,
  buildUpdatedAtColumn,
  buildVersionColumn
} from './order/build-order-columns'

export const OrderTable = ({
  marketId,
  side,
  orderId,
  reference,
  price,
  size,
  type,
  peggedOrder,
  createdAt,
  updatedAt,
  remaining,
  status,
  version
}: Partial<{
  marketId?: string
  orderId?: string
  side?: vegaSide
  size?: string
  price?: string
  reference?: string
  type?: vegaOrderType
  peggedOrder?: PeggedOrderOptions
  createdAt?: string
  updatedAt?: string
  remaining?: string
  status?: vegaOrderStatus
  version?: string
}>) => {
  const columns = [
    buildPriceColumn(price, marketId, type),
    buildPeggedOrderColumn(peggedOrder, marketId),
    buildSizeColumn(size, marketId),
    buildMarketColumn(marketId),
    buildOrderColumn(orderId),
    buildSideColumn(side),
    buildTypeColumn(type),
    buildReferenceColumn(reference),
    buildCreatedAtColumn(createdAt),
    buildUpdatedAtColumn(updatedAt),
    buildRemainingColumn(remaining, marketId),
    buildStatusColumn(status),
    buildVersionColumn(version)
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]

  return <DataTable items={data} />
}
