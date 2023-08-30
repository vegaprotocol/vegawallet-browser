import { OrderType } from '@vegaprotocol/types'

export const orderTypeShort: Record<OrderType, string> = {
  TYPE_LIMIT: 'Limit',
  TYPE_MARKET: 'Market',
  TYPE_NETWORK: 'Network'
}

export const OrderTypeComponent = ({ type }: { type: OrderType }) => <>{orderTypeShort[type]}</>
