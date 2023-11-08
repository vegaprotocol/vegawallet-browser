import { renderHook } from '@testing-library/react'
import { silenceErrors } from '../../test-helpers/silence-errors'
import { mockStore } from '../../test-helpers/mock-store'
import { useMarketsStore } from '../../stores/markets-store'
import { useMarketPrice } from './format-market-price'

jest.mock('../../stores/markets-store')

describe('formatMarketPrice', () => {
  it('throw error if market decimals are not defined', () => {
    silenceErrors()
    mockStore(useMarketsStore, {
      getMarketById: () => ({
        marketDecimals: undefined
      })
    })
    expect(() => renderHook(() => useMarketPrice('foo', '123'))).toThrowError('Could not find market or marketDecimals')
  })

  it('throw error if market is not defined', () => {
    silenceErrors()
    mockStore(useMarketsStore, {
      getMarketById: () => undefined
    })
    expect(() => renderHook(() => useMarketPrice('foo', '123'))).toThrowError('Could not find market or marketDecimals')
  })

  it('returns formatted amount', () => {
    mockStore(useMarketsStore, {
      getMarketById: () => ({
        marketDecimals: 12
      })
    })
    const { result } = renderHook(() => useMarketPrice('foo', '123'))
    expect(result.current).toBe('0.000000000123')
  })
})
