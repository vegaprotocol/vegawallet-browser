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

export const TIF_NUMBER_MAP: { [key: number]: string } = {
  1: TIF_MAP.TIME_IN_FORCE_GTC,
  2: TIF_MAP.TIME_IN_FORCE_GTT,
  3: TIF_MAP.TIME_IN_FORCE_IOC,
  4: TIF_MAP.TIME_IN_FORCE_FOK,
  5: TIF_MAP.TIME_IN_FORCE_GFA,
  6: TIF_MAP.TIME_IN_FORCE_GFN
}

const OrderBadge = ({ children }: { children: ReactNode }) => {
  return <Lozenge className="text-xs mr-0.5 text-vega-dark-400 whitespace-nowrap">{children}</Lozenge>
}

const TifBadge = ({ timeInForce, expiresAt }: { timeInForce: OrderTimeInForce; expiresAt: string | undefined }) => {
  if (timeInForce === OrderTimeInForce.TIME_IN_FORCE_GTT) {
    if (!expiresAt) {
      throw new Error('GTT order without expiresAt')
    }
    const time = Math.floor(+expiresAt / 1e6) // nano seconds to milliseconds
    return <OrderBadge>Good til {getDateTimeFormat().format(new Date(time))}</OrderBadge>
  }
  return <OrderBadge>{typeof timeInForce === 'number' ? TIF_NUMBER_MAP[timeInForce] : TIF_MAP[timeInForce]}</OrderBadge>
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
