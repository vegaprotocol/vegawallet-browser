import { OrderType } from '@vegaprotocol/types'

export const ORDER_TYPE_SHORT: Record<OrderType, string> = {
  TYPE_LIMIT: 'Limit',
  TYPE_MARKET: 'Market',
  TYPE_NETWORK: 'Network'
}

export const ORDER_TYPE_NUMBER_MAP: Record<number, string> = {
  1: ORDER_TYPE_SHORT.TYPE_LIMIT,
  2: ORDER_TYPE_SHORT.TYPE_MARKET,
  3: ORDER_TYPE_SHORT.TYPE_NETWORK
}

export const OrderTypeComponent = ({ type }: { type: OrderType }) => (
  <>{typeof type === 'number' ? ORDER_TYPE_NUMBER_MAP[type] : ORDER_TYPE_SHORT[type]}</>
)
