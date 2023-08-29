import { Lozenge } from '@vegaprotocol/ui-toolkit'
import { OrderTimeInForce } from '@vegaprotocol/types'
import { ReactNode } from 'react'
import { getDateTimeFormat } from '@vegaprotocol/utils'

const TIF_MAP: { [key in OrderTimeInForce]: string } = {
  [OrderTimeInForce.TIME_IN_FORCE_GTC]: 'GTC',
  [OrderTimeInForce.TIME_IN_FORCE_GTT]: 'GTT',
  [OrderTimeInForce.TIME_IN_FORCE_IOC]: 'IOC',
  [OrderTimeInForce.TIME_IN_FORCE_FOK]: 'FOK',
  [OrderTimeInForce.TIME_IN_FORCE_GFA]: 'GFA',
  [OrderTimeInForce.TIME_IN_FORCE_GFN]: 'GFN'
}

const OrderBadge = ({ children }: { children: ReactNode }) => {
  return <Lozenge className="text-xs mr-0.5 text-vega-dark-400 whitespace-nowrap">{children}</Lozenge>
}

const TifBadge = ({ timeInForce, expiresAt }: { timeInForce: OrderTimeInForce; expiresAt: string | null }) => {
  if (timeInForce === OrderTimeInForce.TIME_IN_FORCE_GTT) {
    if (!expiresAt) {
      throw new Error('GTT order without expiresAt')
    }
    return <OrderBadge>Good til {getDateTimeFormat().format(new Date(expiresAt))}</OrderBadge>
  }
  return <OrderBadge>{TIF_MAP[timeInForce]}</OrderBadge>
}

export const OrderBadges = ({
  postOnly,
  reduceOnly,
  timeInForce,
  expiresAt
}: {
  postOnly: boolean | null
  reduceOnly: boolean | null
  timeInForce: OrderTimeInForce
  expiresAt: string | null
}) => {
  const postBadge = postOnly ? <OrderBadge>Post only</OrderBadge> : null
  const reduceBadge = reduceOnly ? <OrderBadge>Reduce only</OrderBadge> : null
  const tifBadge = <TifBadge timeInForce={timeInForce} expiresAt={expiresAt} />
  return (
    <div>
      {tifBadge}
      {reduceBadge}
      {postBadge}
    </div>
  )
}
