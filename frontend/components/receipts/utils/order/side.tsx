import { Side as vegaSide } from '@vegaprotocol/enums'

import { processSide, SIDE_MAP } from '@/lib/enums'

export const Side = ({ side }: { side: vegaSide }) => {
  const sideValue = processSide(side)
  return <>{SIDE_MAP[sideValue]}</>
}
