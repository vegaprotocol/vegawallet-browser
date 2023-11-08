import { renderHook } from '@testing-library/react'
import { silenceErrors } from '../../test-helpers/silence-errors'
import { mockStore } from '../../test-helpers/mock-store'
import { useMarketsStore } from '../../stores/markets-store'
import { useFormatSizeAmount } from './format-size-amount'
import { MAX_POSITION_SIZE } from '../../lib/transactions'

jest.mock('../../stores/markets-store')

describe('formatSizeAmount', () => {
  it('throw error if market decimals are not defined', () => {
    silenceErrors()
    mockStore(useMarketsStore, {
      getMarketById: () => ({
        marketDecimals: undefined
      })
    })
    expect(() => renderHook(() => useFormatSizeAmount('foo', '123'))).toThrowError(
      'Could not find market or positionDecimals'
    )
  })

  it('throw error if market is not defined', () => {
    silenceErrors()
    mockStore(useMarketsStore, {
      getMarketById: () => undefined
    })
    expect(() => renderHook(() => useFormatSizeAmount('foo', '123'))).toThrowError(
      'Could not find market or positionDecimals'
    )
  })

  it('returns formatted amount', () => {
    mockStore(useMarketsStore, {
      getMarketById: () => ({
        positionDecimalPlaces: 12
      })
    })
    const { result } = renderHook(() => useFormatSizeAmount('foo', '123'))
    expect(result.current).toBe('0.000000000123')
  })

  it('returns max when size is max safe integer', () => {
    mockStore(useMarketsStore, {
      getMarketById: () => ({
        positionDecimalPlaces: 12
      })
    })
    const { result } = renderHook(() => useFormatSizeAmount('foo', MAX_POSITION_SIZE))
    expect(result.current).toBe('Max')
  })
})
