import { Side } from '@vegaprotocol/types'

export const SIDE_ENUM_TEXT: Record<Side, string> = {
  SIDE_UNSPECIFIED: 'Unspecified',
  SIDE_BUY: 'Long',
  SIDE_SELL: 'Short'
}

export const SIDE_NUMBER_TEXT: Record<number, string> = {
  0: SIDE_ENUM_TEXT.SIDE_UNSPECIFIED,
  1: SIDE_ENUM_TEXT.SIDE_BUY,
  2: SIDE_ENUM_TEXT.SIDE_SELL
}

export const Direction = ({ side }: { side: Side }) => (
  <>{typeof side === 'number' ? SIDE_NUMBER_TEXT[side] : SIDE_ENUM_TEXT[side]}</>
)
