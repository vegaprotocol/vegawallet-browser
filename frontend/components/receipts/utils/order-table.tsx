import { ReactNode } from 'react'
import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { vegaOrderType, vegaSide } from '@vegaprotocol/rest-clients/dist/trading-data'
import { DataTable } from '../../data-table/data-table'
import { PeggedOrderOptions } from '../../../types/transactions.ts'
import { useMarketsStore, getSettlementAssetId } from '../../../stores/markets-store'
import { useAssetsStore } from '../../../stores/assets-store'
import {
  buildPriceColumn,
  buildReferenceColumn,
  buildMarketColumn,
  buildOrderColumn,
  buildDirectionColumn,
  buildPeggedOrderColumn,
  buildSizeColumn,
  buildTypeColumn
} from './order/build-order-columns'

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
  marketId?: string
  orderId?: string
  direction?: vegaSide
  size?: string
  price?: string
  reference?: string
  type?: vegaOrderType
  peggedOrder?: PeggedOrderOptions
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
  let assetInfo
  if (market && !assetsLoading) {
    const settlementAsset = getSettlementAssetId(market)
    if (settlementAsset) {
      assetInfo = getAssetById(settlementAsset)
    }
  }
  const symbol = assetInfo?.details?.symbol
  const shouldDisplayPrice = (price: string | undefined, type: vegaOrderType | undefined) =>
    type === vegaOrderType.TYPE_MARKET || Boolean(price && price !== '0')

  const columns = [
    buildPriceColumn(shouldDisplayPrice(price, type), assetsLoading, price, marketId, formattedPrice, symbol, type),
    buildPeggedOrderColumn(marketsLoading, peggedOrder, marketId, market, symbol),
    buildSizeColumn(marketsLoading, size, marketId, formattedSize, symbol),
    buildMarketColumn(marketsLoading, marketId, market),
    buildOrderColumn(orderId),
    buildDirectionColumn(direction),
    buildTypeColumn(type),
    buildReferenceColumn(reference)
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]

  return <DataTable items={data} />
}
