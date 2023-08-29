import { ReactNode } from 'react'
import { DataTable } from '../../data-table/data-table'
import { ExternalLink, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import config from '!/config'
import { Side } from '@vegaprotocol/types'

const MarketLink = ({ marketId, name }: { marketId: string; name?: string }) => (
  <ExternalLink href={`${config.network.explorer}/markets/${marketId}`}>
    {name ? name : truncateMiddle(marketId)}
  </ExternalLink>
)

const Direction = ({ direction }: { direction: Side }) => {
  return <>{direction === Side.SIDE_BUY ? 'Long' : 'Short'}</>
}

export const OrderTable = ({
  marketId,
  direction,
  orderId,
  reference
}: Partial<{
  marketId: string
  orderId: string
  direction: Side
  size: string
  price: string
  reference: string
}>) => {
  const columns = [
    marketId ? ['Market', <MarketLink marketId={marketId} />] : null,
    orderId ? ['Order', truncateMiddle(orderId)] : null,
    direction ? ['Direction', <Direction direction={direction} />] : null,
    reference ? ['Reference', reference] : null
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]

  return <DataTable items={data} />
}
