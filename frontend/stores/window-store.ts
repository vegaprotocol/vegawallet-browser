import { create } from 'zustand'

// @ts-ignore
const getWindows = () => globalThis.browser?.windows ?? globalThis.chrome?.windows

export type WindowStore = {
  popupOpen: boolean
  popupId: number | null

  focusPopup: () => void

  onCreated: (window: chrome.windows.Window) => void
  onRemoved: (windowId: number) => void

  setup: () => void
  teardown: () => void
}

// This is needed because in order to mock the windows functions in tests
// if the file is immediately evaluated the mock is not present
export const createStore = () =>
  create<WindowStore>()((set, get) => {
    const windows = getWindows()
    return {
      popupOpen: false,
      popupId: null,
      focusPopup: () => {
        const { popupId } = get()
        if (popupId) {
          windows.update(popupId, { focused: true, drawAttention: true })
        } else {
          throw new Error('Tried to focus popup but none existed')
        }
      },
      onCreated: (window) => {
        set({ popupOpen: true, popupId: window.id })
      },
      onRemoved: (windowId) => {
        if (get().popupId === windowId) {
          set({ popupOpen: false, popupId: null })
        }
      },
      setup: async () => {
        windows.onCreated.addListener(get().onCreated, {
          windowTypes: ['popup']
        })
        windows.onRemoved.addListener(get().onRemoved, {
          windowTypes: ['popup']
        })
        const wins = await windows.getAll({
          windowTypes: ['popup']
        })
        if (wins.length === 1) {
          set({ popupOpen: true, popupId: wins[0].id })
        } else if (wins.length > 1) {
          throw new Error('Multiple popups open, this should not happen')
        }
      },
      teardown: () => {
        windows.onCreated.removeListener(get().onCreated)
        windows.onRemoved.removeListener(get().onRemoved)
        set({
          popupOpen: false,
          popupId: null
        })
      }
    }
  })

export const useWindowStore = createStore()
