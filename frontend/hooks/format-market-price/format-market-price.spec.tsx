import { renderHook } from '@testing-library/react'
import { silenceErrors } from '../../test-helpers/silence-errors'
import { mockStore } from '../../test-helpers/mock-store'
import { useMarketsStore } from '../../stores/markets-store'
import { useFormatMarketPrice } from './format-market-price'

jest.mock('../../stores/markets-store')

describe('useFormatMarketPrice', () => {
  it('throw error if market decimals are not defined', () => {
    silenceErrors()
    mockStore(useMarketsStore, {
      getMarketById: () => ({
        marketDecimals: undefined
      })
    })
    expect(() => renderHook(() => useFormatMarketPrice('foo', '123'))).toThrowError(
      'Could not find market or marketDecimals'
    )
  })

  it('throw error if market is not defined', () => {
    silenceErrors()
    mockStore(useMarketsStore, {
      getMarketById: () => undefined
    })
    expect(() => renderHook(() => useFormatMarketPrice('foo', '123'))).toThrowError(
      'Could not find market or marketDecimals'
    )
  })

  it('returns formatted amount', () => {
    mockStore(useMarketsStore, {
      getMarketById: () => ({
        marketDecimals: 12
      })
    })
    const { result } = renderHook(() => useFormatMarketPrice('foo', '123'))
    expect(result.current).toBe('0.000000000123')
  })

  it('returns undefined if loading', () => {
    mockStore(useMarketsStore, {
      loading: true,
      getMarketById: () => ({
        marketDecimals: 12
      })
    })
    const { result } = renderHook(() => useFormatMarketPrice('foo', '123'))
    expect(result.current).toBeUndefined()
  })

  it('returns undefined if no market is provided', () => {
    mockStore(useMarketsStore, {
      getMarketById: () => ({
        marketDecimals: 12
      })
    })
    const { result } = renderHook(() => useFormatMarketPrice(undefined, '123'))
    expect(result.current).toBeUndefined()
  })

  it('returns undefined if no price is provided', () => {
    mockStore(useMarketsStore, {
      getMarketById: () => ({
        marketDecimals: 12
      })
    })
    const { result } = renderHook(() => useFormatMarketPrice('foo', undefined))
    expect(result.current).toBeUndefined()
  })
})
