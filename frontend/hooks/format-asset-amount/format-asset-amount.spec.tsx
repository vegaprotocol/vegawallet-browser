import { renderHook } from '@testing-library/react'
import { useAssetsStore } from '../../stores/assets-store'
import { useFormatAssetAmount } from './format-asset-amount'
import { silenceErrors } from '../../test-helpers/silence-errors'

jest.mock('../../stores/assets-store')

describe('formatAssetAmount', () => {
  it('throw error if asset symbol is not defined', () => {
    silenceErrors()
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((fn) => ({
      getAssetById: () => ({
        details: {
          symbol: undefined,
          decimals: 18
        }
      })
    }))
    expect(() => renderHook(() => useFormatAssetAmount('foo', '123'))).toThrowError(
      'Could not find amount, decimals or symbol when trying to render transaction for asset foo'
    )
  })

  it('throw error if asset decimals is not defined', () => {
    silenceErrors()
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((fn) => ({
      getAssetById: () => ({
        details: {
          symbol: 'SYMBOL',
          decimals: undefined
        }
      })
    }))
    expect(() => renderHook(() => useFormatAssetAmount('foo', '123'))).toThrowError(
      'Could not find amount, decimals or symbol when trying to render transaction for asset foo'
    )
  })
  it('returns formatted amount and symbol', () => {
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((fn) => ({
      getAssetById: () => ({
        details: {
          symbol: 'SYMBOL',
          decimals: 12
        }
      })
    }))
    const { result } = renderHook(() => useFormatAssetAmount('foo', '123'))
    expect(result.current.formattedAmount).toBe('0.000000000123')
    expect(result.current.symbol).toBe('SYMBOL')
  })
})
