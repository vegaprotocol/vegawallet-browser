import { silenceErrors } from '../test-helpers/silence-errors'
import { createStore } from './popover-store'

const mockBrowser = () => {
  // @ts-ignore
  globalThis.browser = {
    windows: {
      update: jest.fn(),
      onCreated: {
        addListener: jest.fn(),
        removeListener: jest.fn()
      },
      remove: jest.fn(),
      onRemoved: {
        addListener: jest.fn(),
        removeListener: jest.fn()
      },
      getAll: jest.fn().mockReturnValue([]),
      getCurrent: jest.fn().mockReturnValue({ id: 1 })
    }
  }
}

const mockChrome = () => {
  globalThis.chrome = {
    windows: {
      update: jest.fn(),
      // @ts-ignore
      onCreated: {
        addListener: jest.fn(),
        removeListener: jest.fn()
      },
      remove: jest.fn(),
      // @ts-ignore
      onRemoved: {
        addListener: jest.fn(),
        removeListener: jest.fn()
      },
      getAll: jest.fn().mockReturnValue([]),
      getCurrent: jest.fn().mockReturnValue({ id: 1 })
    }
  }
}

const initialState = createStore().getState()

describe('useWindowStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    createStore().setState(initialState)
  })
  afterEach(() => {
    // @ts-ignore
    delete globalThis.browser
    // @ts-ignore
    delete globalThis.chrome
  })
  it('uses browser if chrome is not defined', () => {
    mockBrowser()
    const windowStore = createStore()
    windowStore.getState().setup()
    expect(windowStore.getState().popoverOpen).toBe(false)
    expect(windowStore.getState().popoverId).toBe(null)
  })
  it('uses chrome if browser is not defined', () => {
    mockChrome()
    const windowStore = createStore()
    windowStore.getState().setup()
    expect(windowStore.getState().popoverOpen).toBe(false)
    expect(windowStore.getState().popoverId).toBe(null)
  })

  it('initially sets popupId and popupOpen are falsey', () => {
    mockChrome()
    const windowStore = createStore()
    expect(windowStore.getState().popoverId).toBe(null)
    expect(windowStore.getState().popoverOpen).toBe(false)
  })

  it('setup sets up listeners', async () => {
    mockChrome()
    const windowStore = createStore()
    await windowStore.getState().setup()
    const { windows } = globalThis.chrome
    expect(windows.onRemoved.addListener).toHaveBeenCalledWith(windowStore.getState().onRemoved, {
      windowTypes: ['popup']
    })
    expect(windows.onRemoved.addListener).toBeCalledTimes(1)
    expect(windows.onCreated.addListener).toHaveBeenCalledWith(windowStore.getState().onCreated, {
      windowTypes: ['popup']
    })
    expect(windows.onCreated.addListener).toBeCalledTimes(1)
  })
  it('setup throws error if there a multiple popups', async () => {
    silenceErrors()
    mockChrome()
    const windowStore = createStore()
    globalThis.chrome.windows.getAll = jest.fn().mockReturnValue([{ id: 1 }, { id: 2 }])
    await expect(() => windowStore.getState().setup()).rejects.toThrow('Multiple popups open, this should not happen')
  })
  it('setup sets popup open if there is a popup', async () => {
    mockChrome()
    const windowStore = createStore()
    globalThis.chrome.windows.getAll = jest.fn().mockReturnValue([{ id: 1 }])
    await windowStore.getState().setup()
    expect(windowStore.getState().popoverOpen).toBe(true)
  })
  it('setup sets isPopoverInstance to be true current window has same id as popover', async () => {
    mockChrome()
    const windowStore = createStore()
    globalThis.chrome.windows.getAll = jest.fn().mockReturnValue([{ id: 1 }])
    globalThis.chrome.windows.getCurrent = jest.fn().mockReturnValue({ id: 1 })
    await windowStore.getState().setup()
    expect(windowStore.getState().isPopoverInstance).toBe(true)
  })
  it('setup leaves popup as false if there is not a popup', async () => {
    mockChrome()
    const windowStore = createStore()
    globalThis.chrome.windows.getAll = jest.fn().mockReturnValue([])
    await windowStore.getState().setup()
    expect(windowStore.getState().popoverOpen).toBe(false)
  })
  it('teardown removes listeners and resets state', () => {
    mockChrome()
    const windowStore = createStore()
    windowStore.getState().teardown()
    const { windows } = globalThis.chrome
    expect(windows.onRemoved.removeListener).toHaveBeenCalledWith(windowStore.getState().onRemoved)
    expect(windows.onRemoved.removeListener).toBeCalledTimes(1)
    expect(windows.onCreated.removeListener).toHaveBeenCalledWith(windowStore.getState().onCreated)
    expect(windows.onCreated.removeListener).toBeCalledTimes(1)
    expect(windowStore.getState().popoverOpen).toBe(false)
    expect(windowStore.getState().popoverId).toBe(null)
  })
  it('onCreate sets popupOpen to true and popupId to windowId', () => {
    mockChrome()
    const windowStore = createStore()
    windowStore.getState().onCreated({ id: 1 } as unknown as chrome.windows.Window)
    expect(windowStore.getState().popoverOpen).toBe(true)
    expect(windowStore.getState().popoverId).toBe(1)
  })
  it('onRemove sets popupOpen to false and popupId to null', () => {
    mockChrome()
    const windowStore = createStore()
    windowStore.setState({ popoverId: 1, popoverOpen: true })
    windowStore.getState().onRemoved(1)
    expect(windowStore.getState().popoverOpen).toBe(false)
    expect(windowStore.getState().popoverId).toBe(null)
  })
  it('onRemove sets nothing if id does not match popupId', () => {
    mockChrome()
    const windowStore = createStore()
    windowStore.setState({ popoverId: 1, popoverOpen: true })
    windowStore.getState().onRemoved(2)
    expect(windowStore.getState().popoverOpen).toBe(true)
    expect(windowStore.getState().popoverId).toBe(1)
  })
  it('focusPopover removes the current window and reset the state', () => {
    mockChrome()
    const windowStore = createStore()
    windowStore.setState({ popoverId: 1, popoverOpen: true })
    windowStore.getState().focusPopover()
    expect(globalThis.chrome.windows.remove).toHaveBeenCalledWith(1)
    expect(globalThis.chrome.windows.remove).toBeCalledTimes(1)
    expect(windowStore.getState().popoverOpen).toBe(false)
    expect(windowStore.getState().popoverId).toBe(null)
  })
  it('focusPopover throws error if popupId is null', () => {
    silenceErrors()
    mockChrome()
    const windowStore = createStore()
    expect(() => windowStore.getState().focusPopover()).toThrow('Tried to focus popover but no popover is open')
  })
})
