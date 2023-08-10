import { renderHook } from '@testing-library/react'
import { useListenForPopups } from '.'

const setup = jest.fn()
const teardown = jest.fn()

jest.mock('../../stores/popover-store', () => ({
  usePopoverStore: jest.fn().mockImplementation((fn) =>
    fn({
      setup,
      teardown
    })
  )
}))

describe('ListenForPopups', () => {
  it('returns the wallets page by default', async () => {
    const view = renderHook(() => useListenForPopups())
    expect(setup).toBeCalled()
    expect(teardown).not.toBeCalled()
    view.unmount()
    expect(teardown).toBeCalled()
  })
})
