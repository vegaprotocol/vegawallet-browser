import { getDateTimeFormat } from '@vegaprotocol/utils'

export const formatNanoDate = (nanoSeconds: string | number) => {
  const milliseconds = Math.round(+nanoSeconds / 1e6)
  try {
    return getDateTimeFormat().format(new Date(milliseconds))
  } catch (e) {
    return `Invalid time value: ${nanoSeconds}`
  }
}
