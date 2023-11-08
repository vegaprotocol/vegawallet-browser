import { ReactNode } from 'react'
import { vegaOrderType, vegaSide, vegaOrderStatus } from '@vegaprotocol/rest-clients/dist/trading-data'
import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { PeggedOrderOptions } from '../../../../types/transactions'
import { OrderPriceComponent } from './order-price'
import { OrderSizeComponent } from './order-size'
import { OrderMarketComponent } from './order-market'
import { OrderTypeComponent } from './order-type'
import { PeggedOrderInfo } from './pegged-order-info'
import { Side } from './side'
import { formatDateWithLocalTimezone } from '@vegaprotocol/utils'
import { nanoSecondsToMilliseconds } from '../../../../lib/utils'
import { CopyWithCheckmark } from '../../../copy-with-check'

const orderStatuses: Record<vegaOrderStatus, string> = {
  STATUS_UNSPECIFIED: 'Unspecified',
  STATUS_ACTIVE: 'Active',
  STATUS_EXPIRED: 'Expired',
  STATUS_CANCELLED: 'Cancelled',
  STATUS_STOPPED: 'Stopped',
  STATUS_FILLED: 'Filled',
  STATUS_REJECTED: 'Rejected',
  STATUS_PARTIALLY_FILLED: 'Partially FILLED',
  STATUS_PARKED: 'Parked'
}

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
  if (!orderId) {
    return null
  }
  return [
    'Order',
    <CopyWithCheckmark text={orderId} key="order-value">
      {truncateMiddle(orderId)}
    </CopyWithCheckmark>
  ]
}

export const buildSideColumn = (side?: vegaSide): [ReactNode, ReactNode] | null => {
  if (!side) return null
  return ['Side', <Side key="order-details-direction" side={side} />]
}

export const buildTypeColumn = (type?: vegaOrderType): [ReactNode, ReactNode] | null => {
  if (!type) return null
  return ['Type', <OrderTypeComponent key="order-details-type" type={type} />]
}

export const buildReferenceColumn = (reference?: string): [ReactNode, ReactNode] | null => {
  if (!reference) return null
  return [
    'Reference',
    <CopyWithCheckmark text={reference} key="order-reference">
      {truncateMiddle(reference)}
    </CopyWithCheckmark>
  ]
}

export const buildCreatedAtColumn = (createdAt?: string): [ReactNode, ReactNode] | null => {
  if (!createdAt) return null

  const formattedDate = formatDateWithLocalTimezone(new Date(nanoSecondsToMilliseconds(createdAt)))
  return ['Created at', formattedDate]
}

export const buildUpdatedAtColumn = (updatedAt?: string): [ReactNode, ReactNode] | null => {
  if (!updatedAt || updatedAt === '0') return null

  const formattedDate = formatDateWithLocalTimezone(new Date(nanoSecondsToMilliseconds(updatedAt)))
  return ['Updated at', formattedDate]
}

export const buildRemainingColumn = (
  marketsLoading: boolean,
  remaining?: string,
  marketId?: string,
  formattedRemaining?: string
): [ReactNode, ReactNode] | null => {
  if (!remaining || !marketId) return null
  return [
    'Remaining',
    <OrderSizeComponent
      key="order-details-remaining"
      marketsLoading={marketsLoading}
      size={remaining}
      marketId={marketId}
      formattedSize={formattedRemaining}
    />
  ]
}

export const buildStatusColumn = (status?: vegaOrderStatus): [ReactNode, ReactNode] | null => {
  if (!status) return null
  return ['Status', orderStatuses[status]]
}

export const buildVersionColumn = (version?: string): [ReactNode, ReactNode] | null => {
  if (!version) return null
  return ['Version', version]
}
