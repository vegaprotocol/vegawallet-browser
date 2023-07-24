import { renderHook } from '@testing-library/react'
import { usePing } from '.'
import initKeepAlive from '../../../lib/mv3-keep-alive'
import { mockClient } from '../../test-helpers/mock-client'

jest.mock('../../../lib/mv3-keep-alive')

describe('usePing', () => {
  test('should setup and clean up interval and timeout properly', () => {
    mockClient()
    const mockKeepAlive = jest.fn()
    ;(initKeepAlive as jest.Mock).mockReturnValue(
      mockKeepAlive.mockReturnValueOnce({ keepAliveTimeout: 1, keepAliveInterval: 2 })
    )

    const { unmount } = renderHook(() => usePing())

    expect(initKeepAlive).toHaveBeenCalled()
    expect(mockKeepAlive).toHaveBeenCalled()

    unmount()
    expect(mockKeepAlive).toHaveBeenCalledWith(null)
  })
})
