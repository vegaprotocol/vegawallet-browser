import { formatDate, formatNanoDate, nanoSecondsToMilliseconds } from './utils'

describe('nanoSecondsToMilliseconds', () => {
  it('should convert nanoseconds to milliseconds correctly', () => {
    expect(nanoSecondsToMilliseconds('1000000000')).toEqual(1000)
    expect(nanoSecondsToMilliseconds('5000000000')).toEqual(5000)
    expect(nanoSecondsToMilliseconds('15000000000')).toEqual(15000)
  })
})

describe('formatNanoDate', () => {
  it('should format nanoSeconds to a valid date string', () => {
    const nanoSeconds = '1640995200000000000'
    const expected = '1/1/2022, 12:00:00 AM'

    expect(formatNanoDate(nanoSeconds)).toBe(expected)
  })

  it('should handle invalid nanoSeconds and return an error message', () => {
    const nanoSeconds = 'invalid'
    const expected = 'Invalid time value: invalid'

    expect(formatNanoDate(nanoSeconds)).toBe(expected)
  })
})

describe('formatDate', () => {
  it('should format milliseconds date to a readable format correctly', () => {
    expect(formatDate('invalid')).toEqual('Invalid time value: invalid')
    expect(formatDate(1612432362000)).toEqual('2/4/2021, 9:52:42 AM')
  })
})
