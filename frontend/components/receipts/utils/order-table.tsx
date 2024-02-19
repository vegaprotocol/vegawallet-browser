import { vegaOrderStatus, vegaOrderType, vegaSide } from '@vegaprotocol/rest-clients/dist/trading-data'
import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { formatDateWithLocalTimezone } from '@vegaprotocol/utils'

import { ConditionalDataTable, RowConfig } from '@/components/data-table/conditional-data-table'
import { ORDER_STATUS_MAP } from '@/components/enums'
import { MarketLink } from '@/components/vega-entities/market-link'
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
      render: (data) => [
        'Price',
        <OrderPrice key="order-details-price" price={data.price} marketId={data.marketId} type={data.type} />
      ]
    },
    {
      prop: 'peggedOrder',
      render: (data) => [
        'Pegged price',
        <PeggedOrderInfo key="order-details-pegged" peggedOrder={data.peggedOrder} marketId={data.marketId} />
      ]
    },
    {
      prop: 'size',
      render: (data) => ['Size', <OrderSize key="order-details-size" size={data.size} marketId={data.marketId} />]
    },
    {
      prop: 'marketId',
      render: () => ['Market', <VegaMarket key="order-details-market" marketId={properties.marketId} />]
    },
    {
      prop: 'marketId',
      render: (data) => ['Market Id', <MarketLink key="order-details-market-id" marketId={data.marketId} />]
    },
    {
      prop: 'orderId',
      render: (data) => [
        'Order',
        <CopyWithCheckmark text={data.orderId!} key="order-value">
          {truncateMiddle(data.orderId!)}
        </CopyWithCheckmark>
      ]
    },
    { prop: 'side', render: (data) => ['Side', <Side key="order-details-direction" side={data.side} />] },
    { prop: 'type', render: (data) => ['Type', <OrderType key="order-details-type" type={data.type} />] },
    {
      prop: 'reference',
      render: (data) => [
        'Reference',
        <CopyWithCheckmark text={data.reference!} key="order-reference">
          {truncateMiddle(data.reference!)}
        </CopyWithCheckmark>
      ]
    },
    {
      prop: 'createdAt',
      render: (data) => [
        'Created at',
        formatDateWithLocalTimezone(new Date(nanoSecondsToMilliseconds(data.createdAt!)))
      ]
    },
    {
      prop: 'updatedAt',
      render: (data) => [
        'Updated at',
        formatDateWithLocalTimezone(new Date(nanoSecondsToMilliseconds(data.updatedAt!)))
      ]
    },
    {
      prop: 'remaining',
      render: (data) => [
        'Remaining',
        <OrderSize key="order-details-remaining" size={data.remaining} marketId={data.marketId} />
      ]
    },
    { prop: 'status', render: (data) => ['Status', ORDER_STATUS_MAP[data.status!]] },
    { prop: 'version', render: (data) => ['Version', data.version] }
  ]

  return <ConditionalDataTable items={items} data={properties} />
}
