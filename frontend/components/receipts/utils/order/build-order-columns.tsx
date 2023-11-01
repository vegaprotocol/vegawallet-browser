import { ReactNode } from 'react'
import { vegaOrderType, vegaSide } from '@vegaprotocol/rest-clients/dist/trading-data'
import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { PeggedOrderOptions } from '../../../../types/transactions'
import { OrderPriceComponent } from './order-price'
import { OrderSizeComponent } from './order-size'
import { OrderMarketComponent } from './order-market'
import { OrderTypeComponent } from './order-type'
import { PeggedOrderInfo } from './pegged-order-info'
import { Direction } from './direction'

// Helper functions for building individual columns for the order table
export const buildPriceColumn = (
  assetsLoading: boolean,
  price?: string,
  marketId?: string,
  formattedPrice?: string,
  symbol?: string,
  type?: vegaOrderType
): [ReactNode, ReactNode] | null => {
  if (!price) return null
  return [
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
}

export const buildPeggedOrderColumn = (
  marketsLoading: boolean,
  peggedOrder?: PeggedOrderOptions,
  marketId?: string,
  market?: any,
  symbol?: string
): [ReactNode, ReactNode] | null => {
  if (!peggedOrder || !marketId) return null
  return [
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
}

export const buildSizeColumn = (
  marketsLoading: boolean,
  size?: string,
  marketId?: string,
  formattedSize?: string
): [ReactNode, ReactNode] | null => {
  if (!size || !marketId) return null
  return [
    'Size',
    <OrderSizeComponent
      key="order-details-size"
      marketsLoading={marketsLoading}
      size={size}
      marketId={marketId}
      formattedSize={formattedSize}
    />
  ]
}

export const buildMarketColumn = (
  marketsLoading: boolean,
  marketId?: string,
  market?: any
): [ReactNode, ReactNode] | null => {
  if (!marketId) return null
  return [
    'Market',
    <OrderMarketComponent
      key="order-details-market"
      marketsLoading={marketsLoading}
      marketId={marketId}
      market={market}
    />
  ]
}

export const buildOrderColumn = (orderId?: string): [ReactNode, ReactNode] | null => {
  if (!orderId) return null
  return ['Order', truncateMiddle(orderId)]
}

export const buildDirectionColumn = (direction?: vegaSide): [ReactNode, ReactNode] | null => {
  if (!direction) return null
  return ['Direction', <Direction key="order-details-direction" direction={direction} />]
}

export const buildTypeColumn = (type?: vegaOrderType): [ReactNode, ReactNode] | null => {
  if (!type) return null
  return ['Type', <OrderTypeComponent key="order-details-type" type={type} />]
}

export const buildReferenceColumn = (reference?: string): [ReactNode, ReactNode] | null => {
  if (!reference) return null
  return ['Reference', reference]
}
