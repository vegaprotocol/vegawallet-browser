import { vegaOrderStatus, vegaOrderType, vegaSide } from '@vegaprotocol/rest-clients/dist/trading-data'
import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { formatDateWithLocalTimezone } from '@vegaprotocol/utils'
import { ReactNode } from 'react'

import { MarketLink } from '@/components/vega-entities/market-link'
import { ORDER_STATUS_MAP, processOrderStatus } from '@/lib/enums'
import { nanoSecondsToMilliseconds } from '@/lib/utils'
import { PeggedOrderOptions } from '@/types/transactions'

import { CopyWithCheckmark } from '../../../copy-with-check'
import { VegaMarket } from '../../../vega-entities/vega-market'
import { OrderPrice } from './order-price'
import { OrderSize } from './order-size'
import { OrderType } from './order-type'
import { PeggedOrderInfo } from './pegged-order-info'
import { Side } from './side'

// Helper functions for building individual columns for the order table
export const buildPriceColumn = (
  price?: string,
  marketId?: string,
  type?: vegaOrderType
): [ReactNode, ReactNode] | null => {
  if (!price || !marketId) return null
  return ['Price', <OrderPrice key="order-details-price" price={price} marketId={marketId} type={type} />]
}

export const buildPeggedOrderColumn = (
  peggedOrder?: PeggedOrderOptions,
  marketId?: string
): [ReactNode, ReactNode] | null => {
  if (!peggedOrder || !marketId) return null
  return ['Pegged price', <PeggedOrderInfo key="order-details-pegged" peggedOrder={peggedOrder} marketId={marketId} />]
}

export const buildSizeColumn = (size?: string, marketId?: string): [ReactNode, ReactNode] | null => {
  if (!size || !marketId) return null
  return ['Size', <OrderSize key="order-details-size" size={size} marketId={marketId} />]
}

export const buildNameMarketColumn = (marketId?: string): [ReactNode, ReactNode] | null => {
  if (!marketId) return null
  return ['Market', <VegaMarket key="order-details-market" marketId={marketId} />]
}

export const buildMarketIdColumn = (marketId?: string): [ReactNode, ReactNode] | null => {
  if (!marketId) return null
  return ['Market Id', <MarketLink key="order-details-market-id" marketId={marketId} />]
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
  return ['Type', <OrderType key="order-details-type" type={type} />]
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

export const buildRemainingColumn = (remaining?: string, marketId?: string): [ReactNode, ReactNode] | null => {
  if (!remaining || !marketId) return null
  return ['Remaining', <OrderSize key="order-details-remaining" size={remaining} marketId={marketId} />]
}

export const buildStatusColumn = (status?: vegaOrderStatus): [ReactNode, ReactNode] | null => {
  if (!status) return null
  const orderStatus = processOrderStatus(status)
  return ['Status', ORDER_STATUS_MAP[orderStatus]]
}

export const buildVersionColumn = (version?: string): [ReactNode, ReactNode] | null => {
  if (!version) return null
  return ['Version', version]
}
