import { formatNanoDate } from './utils'

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
