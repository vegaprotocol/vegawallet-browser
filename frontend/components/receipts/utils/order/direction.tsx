import { vegaSide } from '@vegaprotocol/rest-clients/dist/trading-data'

export const sideText: Record<vegaSide, string> = {
  SIDE_UNSPECIFIED: 'Unspecified',
  SIDE_BUY: 'Long',
  SIDE_SELL: 'Short'
}

export const Direction = ({ direction }: { direction: vegaSide }) => <>{sideText[direction]}</>
