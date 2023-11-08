import { ReactNode } from 'react'
import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { vegaOrderType, vegaSide, vegaOrderStatus } from '@vegaprotocol/rest-clients/dist/trading-data'
import { DataTable } from '../../data-table/data-table'
import { PeggedOrderOptions } from '../../../types/transactions'
import { useMarketsStore } from '../../../stores/markets-store'
import { useAssetsStore } from '../../../stores/assets-store'
import {
  buildPriceColumn,
  buildReferenceColumn,
  buildMarketColumn,
  buildOrderColumn,
  buildSideColumn,
  buildPeggedOrderColumn,
  buildSizeColumn,
  buildTypeColumn,
  buildCreatedAtColumn,
  buildUpdatedAtColumn,
  buildRemainingColumn,
  buildStatusColumn,
  buildVersionColumn
} from './order/build-order-columns'
import { getSettlementAssetId } from '../../../lib/markets'

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
  const { loading: assetsLoading, getAssetById } = useAssetsStore((state) => ({
    loading: state.loading,
    assets: state.assets,
    getAssetById: state.getAssetById
  }))
  const { loading: marketsLoading, getMarketById } = useMarketsStore((state) => ({
    loading: state.loading,
    getMarketById: state.getMarketById
  }))

  const market = marketId && !marketsLoading ? getMarketById(marketId) : undefined
  const marketDecimals = Number(market?.decimalPlaces)
  const positionDecimals = Number(market?.positionDecimalPlaces)
  const formattedPrice =
    price && marketDecimals ? formatNumber(toBigNum(price, marketDecimals), marketDecimals) : undefined
  const formattedSize =
    size && positionDecimals ? formatNumber(toBigNum(size, positionDecimals), positionDecimals) : undefined
  const formattedRemaining =
    remaining && positionDecimals ? formatNumber(toBigNum(remaining, positionDecimals), positionDecimals) : undefined

  let assetInfo
  if (market && !assetsLoading) {
    const settlementAsset = getSettlementAssetId(market)
    if (settlementAsset) {
      assetInfo = getAssetById(settlementAsset)
    }
  }
  const symbol = assetInfo?.details?.symbol

  const columns = [
    buildPriceColumn(assetsLoading, price, marketId, formattedPrice, symbol, type),
    buildPeggedOrderColumn(marketsLoading, peggedOrder, marketId, market, symbol),
    buildSizeColumn(marketsLoading, size, marketId, formattedSize),
    buildMarketColumn(marketsLoading, marketId, market),
    buildOrderColumn(orderId),
    buildSideColumn(side),
    buildTypeColumn(type),
    buildReferenceColumn(reference),
    buildCreatedAtColumn(createdAt),
    buildUpdatedAtColumn(updatedAt),
    buildRemainingColumn(marketsLoading, remaining, marketId, formattedRemaining),
    buildStatusColumn(status),
    buildVersionColumn(version)
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]

  return <DataTable items={data} />
}
