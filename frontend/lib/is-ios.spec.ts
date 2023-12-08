import { isIos } from './is-ios'

const navigator = window.navigator

describe('isIos', () => {
  afterEach(() => {
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: navigator
    })
  })

  it('returns true when userAgent contains iPad', () => {
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {
        userAgent: 'iPad'
      }
    })

    const result = isIos()

    expect(result).toBe(true)
  })

  it('returns true when userAgent contains iPhone', () => {
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {
        userAgent: 'iPhone'
      }
    })
    const result = isIos()

    expect(result).toBe(true)
  })

  it('returns true when userAgent contains iPod', () => {
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {
        userAgent: 'iPod'
      }
    })
    const result = isIos()

    expect(result).toBe(true)
  })

  it('returns true when platform is MacIntel and maxTouchPoints > 1', () => {
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {
        platform: 'MacIntel',
        maxTouchPoints: 2
      }
    })

    const result = isIos()

    expect(result).toBe(true)
  })

  it('returns false when userAgent and platform conditions are not met', () => {
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {
        userAgent: 'Some non-iOS user agent',
        platform: 'Some non-MacIntel platform'
      }
    })

    const result = isIos()

    expect(result).toBe(false)
  })
})
