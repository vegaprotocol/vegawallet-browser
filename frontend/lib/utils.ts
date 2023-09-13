import { getDateTimeFormat } from '@vegaprotocol/utils'

export const formatNanoDate = (nanoSeconds: string | number) => {
  const milliseconds = Math.round(+nanoSeconds / 1e6)
  return getDateTimeFormat().format(new Date(milliseconds))
}
