import TimeAgo from 'javascript-time-ago'

// English.
import en from 'javascript-time-ago/locale/en'
import { useEffect, useMemo, useState } from 'react'
TimeAgo.addDefaultLocale(en)

export const useTimeAgo = (date: string) => {
  const timeAgo = useMemo(() => new TimeAgo('en-GB'), [])
  const dateReceived = useMemo(() => new Date(date), [date])
  const [currentTime, setCurrentTimeTime] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [setCurrentTimeTime])

  return useMemo(() => {
    return timeAgo.format(dateReceived)
    // Force current date as dependency to update time every second
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateReceived, timeAgo, currentTime])
}
