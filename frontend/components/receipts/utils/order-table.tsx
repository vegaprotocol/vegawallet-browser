import { ReactNode } from 'react'
import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { vegaOrderType, vegaSide } from '@vegaprotocol/rest-clients/dist/trading-data'
import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { DataTable } from '../../data-table/data-table'
import { Direction } from './order/direction'
import { OrderTypeComponent } from './order/order-type'
import { PeggedOrderOptions } from '../../../types/transactions.ts'
import { OrderPriceComponent } from './order/order-price'
import { OrderSizeComponent } from './order/order-size'
import { OrderMarketComponent } from './order/order-market'
import { PeggedOrderInfo } from './order/pegged-order-info'
import { useMarketsStore, getSettlementAssetId } from '../../../stores/markets-store'
import { useAssetsStore } from '../../../stores/assets-store'

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
  const {
    loading: assetsLoading,
    assets,
    getAssetById
  } = useAssetsStore((state) => ({
    loading: state.loading,
    assets: state.assets,
    getAssetById: state.getAssetById
  }))
  const {
    loading: marketsLoading,
    markets,
    getMarketById
  } = useMarketsStore((state) => ({
    loading: state.loading,
    markets: state.markets,
    getMarketById: state.getMarketById
  }))

  const market = marketId && markets.length > 0 ? getMarketById(marketId) : undefined
  const marketDecimals = Number(market?.decimalPlaces)
  const positionDecimals = Number(market?.positionDecimalPlaces)
  const formattedPrice =
    price && marketDecimals ? formatNumber(toBigNum(price, marketDecimals), marketDecimals) : undefined
  const formattedSize =
    size && positionDecimals ? formatNumber(toBigNum(size, positionDecimals), positionDecimals) : undefined
  let assetInfo
  if (market && assets.length > 0) {
    const settlementAsset = getSettlementAssetId(market)
    if (settlementAsset) {
      assetInfo = getAssetById(settlementAsset)
    }
  }
  const symbol = assetInfo?.details?.symbol
  // We display the price field if a price is provided and isn't '0', except in the case of market orders.
  const shouldDisplayPrice = (price: string | undefined, type: vegaOrderType | undefined) =>
    type === vegaOrderType.TYPE_MARKET || (price && price !== '0')

  const columns = [
    shouldDisplayPrice(price, type)
      ? [
          'Price',
          <OrderPriceComponent
            key="order-details-price"
            assetsLoading={assetsLoading}
            price={price}
            marketId={marketId}
            formattedPrice={formattedPrice}
            symbol={symbol}
            type={type}
          />
        ]
      : null,
    peggedOrder && marketId
      ? [
          'Pegged price',
          <PeggedOrderInfo
            key="order-details-pegged"
            marketsLoading={marketsLoading}
            market={market}
            peggedOrder={peggedOrder}
            marketId={marketId}
            symbol={symbol}
          />
        ]
      : null,
    size && marketId
      ? [
          'Size',
          <OrderSizeComponent
            key="order-details-size"
            marketsLoading={marketsLoading}
            size={size}
            marketId={marketId}
            formattedSize={formattedSize}
            symbol={symbol}
          />
        ]
      : null,
    marketId
      ? [
          'Market',
          <OrderMarketComponent
            key="order-details-market"
            marketsLoading={marketsLoading}
            marketId={marketId}
            market={market}
          />
        ]
      : null,
    orderId ? ['Order', truncateMiddle(orderId)] : null,
    direction ? ['Direction', <Direction key="order-details-direction" direction={direction} />] : null,
    type ? ['Type', <OrderTypeComponent key="order-details-type" type={type} />] : null,
    reference ? ['Reference', reference] : null
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]

  return <DataTable items={data} />
}
