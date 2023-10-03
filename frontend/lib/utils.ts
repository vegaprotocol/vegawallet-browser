import { getDateTimeFormat } from '@vegaprotocol/utils'

export const nanoSecondsToMilliseconds = (nanoSeconds: string) => {
  return Math.round(+nanoSeconds / 1e6)
}

export const formatNanoDate = (nanoSeconds: string | number) => {
  try {
    const milliseconds = nanoSecondsToMilliseconds(nanoSeconds.toString())
    if (Number.isNaN(milliseconds)) throw new Error('Invalid time value')
    return formatDate(milliseconds)
  } catch (e) {
    return `Invalid time value: ${nanoSeconds}`
  }
}

export const formatDate = (milliseconds: number | string) => {
  try {
    return getDateTimeFormat().format(new Date(+milliseconds))
  } catch (e) {
    return `Invalid time value: ${milliseconds}`
  }
}
