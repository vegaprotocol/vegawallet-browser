import { renderHook } from '@testing-library/react'
import { useListenForPopups } from '.'

const setup = jest.fn()
const teardown = jest.fn()

jest.mock('../../stores/popover-store', () => ({
  usePopoverStore: jest.fn().mockImplementation((function_) =>
    function_({
      setup,
      teardown
    })
  )
}))

describe('ListenForPopups', () => {
  it('returns the wallets page by default', async () => {
    const view = renderHook(() => useListenForPopups())
    expect(setup).toHaveBeenCalled()
    expect(teardown).not.toHaveBeenCalled()
    view.unmount()
    expect(teardown).toHaveBeenCalled()
  })
})
