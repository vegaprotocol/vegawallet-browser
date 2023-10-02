import { vegaOrderType } from '@vegaprotocol/rest-clients/dist/trading-data'

export const orderTypeShort: Record<vegaOrderType, string> = {
  [vegaOrderType.TYPE_LIMIT]: 'Limit',
  [vegaOrderType.TYPE_MARKET]: 'Market',
  [vegaOrderType.TYPE_NETWORK]: 'Network',
  [vegaOrderType.TYPE_UNSPECIFIED]: 'Unspecified'
}

export const OrderTypeComponent = ({ type }: { type: vegaOrderType }) => <>{orderTypeShort[type]}</>
