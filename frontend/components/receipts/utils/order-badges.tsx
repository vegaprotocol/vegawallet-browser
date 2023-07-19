import { Lozenge } from '@vegaprotocol/ui-toolkit'
import { OrderTimeInForce } from '@vegaprotocol/types'
import { ReactNode } from 'react'

const OrderBadge = ({ children }: { children: ReactNode }) => {
  return <Lozenge className="text-xs mr-1">{children}</Lozenge>
}

const TifBadge = ({ timeInForce, expiresAt }: { timeInForce: OrderTimeInForce | null; expiresAt: string | null }) => {
  if (timeInForce === OrderTimeInForce.TIME_IN_FORCE_GTT) return <OrderBadge>Good til {expiresAt}</OrderBadge>
  return <OrderBadge>{timeInForce}</OrderBadge>
}

export const OrderBadges = ({
  postOnly,
  reduceOnly,
  timeInForce,
  expiresAt
}: {
  postOnly: boolean | null
  reduceOnly: boolean | null
  timeInForce: OrderTimeInForce | null
  expiresAt: string | null
}) => {
  const postBadge = postOnly ? <OrderBadge>Post only</OrderBadge> : null
  const reduceBadge = reduceOnly ? <OrderBadge>Reduce only</OrderBadge> : null
  const tifBadge = <TifBadge timeInForce={timeInForce} expiresAt={expiresAt} />
  const badges = [postBadge, reduceBadge, tifBadge].filter(Boolean)
  return <div>{badges}</div>
}
