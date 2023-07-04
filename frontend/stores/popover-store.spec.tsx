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
      onRemoved: {
        addListener: jest.fn(),
        removeListener: jest.fn()
      },
      getAll: jest.fn().mockReturnValue([])
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
      // @ts-ignore
      onRemoved: {
        addListener: jest.fn(),
        removeListener: jest.fn()
      },
      getAll: jest.fn().mockReturnValue([])
    }
  }
}

const initialState = createStore().getState()

describe('useWindowStore', () => {
  beforeEach(() => {
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
  it('setup throws error if there a multiple popups', () => {})
  it('setup sets popup open if there is a popup', () => {})
  it('setup leaves popup as false if there is not a popup', () => {})
  it('teardown removes listeners and resets state', () => {})
  it('onCreate sets popupOpen to true and popupId to windowId', () => {})
  it('onRemove sets popupOpen to false and popupId to null', () => {})
  it('onRemove sets nothing if id does not match popupId', () => {})
  it('focusPopup focuses the popup', () => {})
  it('focusPopup throws error if popupId is null', () => {})
})
