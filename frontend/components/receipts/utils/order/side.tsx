import { vegaSide } from '@vegaprotocol/rest-clients/dist/trading-data'

import { SIDE_MAP } from '@/lib/enums'

export const Side = ({ side }: { side: vegaSide }) => <>{SIDE_MAP[side]}</>
