import { Lozenge } from '@vegaprotocol/ui-toolkit'
import { ReactNode } from 'react'
import { formatNanoDate } from '../../../../lib/utils'
import { OrderTimeInForce } from '@vegaprotocol/rest-clients/dist/trading-data'

const TIF_MAP: { [key in OrderTimeInForce]: string } = {
  [OrderTimeInForce.TIME_IN_FORCE_GTC]: 'GTC',
  [OrderTimeInForce.TIME_IN_FORCE_GTT]: 'GTT',
  [OrderTimeInForce.TIME_IN_FORCE_IOC]: 'IOC',
  [OrderTimeInForce.TIME_IN_FORCE_FOK]: 'FOK',
  [OrderTimeInForce.TIME_IN_FORCE_GFA]: 'GFA',
  [OrderTimeInForce.TIME_IN_FORCE_GFN]: 'GFN',
  [OrderTimeInForce.TIME_IN_FORCE_UNSPECIFIED]: 'Unspecified'
}

const OrderBadge = ({ children }: { children: ReactNode }) => {
  return <Lozenge className="text-xs mr-0.5 text-vega-dark-400 whitespace-nowrap">{children}</Lozenge>
}

const TifBadge = ({ timeInForce, expiresAt }: { timeInForce: OrderTimeInForce; expiresAt: string | undefined }) => {
  if (timeInForce === OrderTimeInForce.TIME_IN_FORCE_GTT) {
    if (!expiresAt) {
      throw new Error('GTT order without expiresAt')
    }
    return <OrderBadge>Good til {formatNanoDate(expiresAt)}</OrderBadge>
  }
  return <OrderBadge>{TIF_MAP[timeInForce]}</OrderBadge>
}

export const OrderBadges = ({
  postOnly,
  reduceOnly,
  timeInForce,
  expiresAt
}: Partial<{
  postOnly: boolean
  reduceOnly: boolean
  timeInForce: OrderTimeInForce
  expiresAt: string
}>) => {
  const postBadge = postOnly ? <OrderBadge>Post only</OrderBadge> : null
  const reduceBadge = reduceOnly ? <OrderBadge>Reduce only</OrderBadge> : null
  const tifBadge = timeInForce ? <TifBadge timeInForce={timeInForce} expiresAt={expiresAt} /> : null
  return (
    <div className="break-all">
      {tifBadge}
      {reduceBadge}
      {postBadge}
    </div>
  )
}
