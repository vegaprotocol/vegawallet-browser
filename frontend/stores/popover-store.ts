import { create } from 'zustand'

// @ts-ignore
const getWindows = () => globalThis.browser?.windows ?? globalThis.chrome?.windows

export type WindowStore = {
  popoverOpen: boolean
  popoverId: number | null
  isPopoverInstance: boolean

  focusPopover: () => void

  onCreated: (window: chrome.windows.Window) => void
  onRemoved: (windowId: number) => Promise<void>

  setup: () => Promise<void>
  teardown: () => void
}

// This is needed because in order to mock the windows functions in tests
// if the file is immediately evaluated the mock is not present
export const createStore = () =>
  create<WindowStore>()((set, get) => {
    const windows = getWindows()
    return {
      isPopoverInstance: false,
      popoverOpen: false,
      popoverId: null,
      focusPopover: () => {
        const { popoverId: popupId } = get()
        if (popupId) {
          windows.remove(popupId)
          set({ popoverOpen: false, popoverId: null })
        } else {
          throw new Error('Tried to focus popover but no popover is open')
        }
      },
      onCreated: (window) => {
        if (window.type === 'popup') {
          set({ popoverOpen: true, popoverId: window.id })
        }
      },
      onRemoved: async (windowId) => {
        const window = await windows.get(windowId)
        if (window && window.type === 'popup' && window.id === get().popoverId) {
          set({ popoverOpen: false, popoverId: null })
        }
      },
      setup: async () => {
        windows.onCreated.addListener(get().onCreated)
        windows.onRemoved.addListener(get().onRemoved)
        const [wins, currentWindow] = await Promise.all([
          windows.getAll({
            windowTypes: ['popup']
          }),
          windows.getCurrent()
        ])

        if (wins.length === 1) {
          set({ popoverOpen: true, popoverId: wins[0].id, isPopoverInstance: wins[0].id === currentWindow.id })
        } else if (wins.length > 1) {
          throw new Error('Multiple popups open, this should not happen')
        }
      },
      teardown: () => {
        windows.onCreated.removeListener(get().onCreated)
        windows.onRemoved.removeListener(get().onRemoved)
        set({
          popoverOpen: false,
          popoverId: null
        })
      }
    }
  })

export const usePopoverStore = createStore()
