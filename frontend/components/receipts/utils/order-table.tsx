import { ReactNode } from 'react'
import { DataTable } from '../../data-table/data-table'
import { ExternalLink, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import config from '!/config'
import { Side } from '@vegaprotocol/types'

const MarketLink = ({ marketId, name }: { marketId: string; name?: string }) => (
  <ExternalLink className="text-vega-dark-400" href={`${config.network.explorer}/markets/${marketId}`}>
    {name ? name : truncateMiddle(marketId)}
  </ExternalLink>
)

const OrderLink = ({ orderId }: { orderId: string }) => (
  <ExternalLink className="text-vega-dark-400" href={`${config.network.explorer}/orders/${orderId}`}>
    {truncateMiddle(orderId)}
  </ExternalLink>
)

const Direction = ({ direction }: { direction: Side }) => {
  return <>{direction === Side.SIDE_BUY ? 'Long' : 'Short'}</>
}

export const OrderTable = ({
  marketId,
  direction,
  size,
  orderId,
  price
}: Partial<{
  marketId: string
  orderId: string
  direction: Side
  size: string
  price: string
}>) => {
  const columns = [
    marketId ? ['Market', <MarketLink marketId={marketId} />] : null,
    orderId ? ['Order', <OrderLink orderId={orderId} />] : null,
    direction ? ['Direction', <Direction direction={direction} />] : null,
    size ? ['Size', size] : null,
    // TODO price makes no sense without decimals
    price ? ['Price', price] : null
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]

  return <DataTable items={data} />
}
