import { vegaOrderStatus, vegaOrderType, vegaSide } from '@vegaprotocol/rest-clients/dist/trading-data'
import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { formatDateWithLocalTimezone } from '@vegaprotocol/utils'

import { ConditionalDataTable, RowConfig } from '@/components/data-table/conditional-data-table'
import { MarketLink } from '@/components/vega-entities/market-link'
import { ORDER_STATUS_MAP, processOrderStatus } from '@/lib/enums'
import { nanoSecondsToMilliseconds } from '@/lib/utils'
import { PeggedOrderOptions } from '@/types/transactions'

import { CopyWithCheckmark } from '../../copy-with-check'
import { VegaMarket } from '../../vega-entities/vega-market'
import { OrderPrice } from './order/order-price'
import { OrderSize } from './order/order-size'
import { OrderType } from './order/order-type'
import { PeggedOrderInfo } from './order/pegged-order-info'
import { Side } from './order/side'

export type OrderTableProperties = Partial<{
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
}>

export const OrderTable = (properties: OrderTableProperties) => {
  const items: RowConfig<OrderTableProperties>[] = [
    {
      prop: 'price',
      props: ['price', 'marketId', 'type'],
      render: (price, { marketId, type }) => [
        'Price',
        <OrderPrice key="order-details-price" price={price} marketId={marketId} type={type} />
      ]
    },
    {
      prop: 'peggedOrder',
      props: ['marketId', 'peggedOrder'],
      render: (peggedOrder, { marketId }) => [
        'Pegged price',
        <PeggedOrderInfo key="order-details-pegged" peggedOrder={peggedOrder} marketId={marketId} />
      ]
    },
    {
      prop: 'size',
      props: ['marketId', 'size'],
      render: (size, { marketId }) => ['Size', <OrderSize key="order-details-size" size={size} marketId={marketId} />]
    },
    {
      prop: 'marketId',
      render: (marketId) => ['Market', <VegaMarket key="order-details-market" marketId={marketId} />]
    },
    {
      prop: 'marketId',
      render: (marketId) => ['Market Id', <MarketLink key="order-details-market-id" marketId={marketId} />]
    },
    {
      prop: 'orderId',
      render: (orderId) => [
        'Order',
        <CopyWithCheckmark text={orderId} key="order-value">
          {truncateMiddle(orderId)}
        </CopyWithCheckmark>
      ]
    },
    { prop: 'side', render: (side) => ['Side', <Side key="order-details-direction" side={side} />] },
    { prop: 'type', render: (type) => ['Type', <OrderType key="order-details-type" type={type} />] },
    {
      prop: 'reference',
      render: (reference) => [
        'Reference',
        <CopyWithCheckmark text={reference} key="order-reference">
          {truncateMiddle(reference)}
        </CopyWithCheckmark>
      ]
    },
    {
      prop: 'createdAt',
      render: (createdAt) => ['Created at', formatDateWithLocalTimezone(new Date(nanoSecondsToMilliseconds(createdAt)))]
    },
    {
      prop: 'updatedAt',
      render: (updatedAt) => ['Updated at', formatDateWithLocalTimezone(new Date(nanoSecondsToMilliseconds(updatedAt)))]
    },
    {
      prop: 'remaining',
      props: ['remaining', 'marketId'],
      render: (remaining, { marketId }) => [
        'Remaining',
        <OrderSize key="order-details-remaining" size={remaining} marketId={marketId} />
      ]
    },
    { prop: 'status', render: (status) => ['Status', ORDER_STATUS_MAP[processOrderStatus(status)]] },
    { prop: 'version', render: (version) => ['Version', version] }
  ]

  return <ConditionalDataTable items={items} data={properties} />
}
