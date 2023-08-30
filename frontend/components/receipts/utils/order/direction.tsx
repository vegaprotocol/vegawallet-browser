import { Side } from '@vegaprotocol/types'

export const sideText: Record<Side, string> = {
  SIDE_UNSPECIFIED: 'Unspecified',
  SIDE_BUY: 'Long',
  SIDE_SELL: 'Short'
}

export const Direction = ({ direction }: { direction: Side }) => <>{sideText[direction]}</>
