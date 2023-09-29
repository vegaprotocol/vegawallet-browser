import { getDateTimeFormat } from '@vegaprotocol/utils'

export const nanoSecondsToMilliseconds = (nanoSeconds: string) => {
  return Math.round(+nanoSeconds / 1e6)
}

export const formatNanoDate = (nanoSeconds: string | number) => {
  const milliseconds = nanoSecondsToMilliseconds(nanoSeconds.toString())
  return formatDate(milliseconds)
}

export const formatDate = (milliseconds: number | string) => {
  try {
    return getDateTimeFormat().format(new Date(milliseconds))
  } catch (e) {
    return `Invalid time value: ${milliseconds}`
  }
}
