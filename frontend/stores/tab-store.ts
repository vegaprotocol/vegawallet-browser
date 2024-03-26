import { create } from 'zustand'

// @ts-ignore
const getTabs = () => globalThis.browser?.tabs ?? globalThis.chrome?.tabs

export type TabStore = {
  onUpdated: any
  currentTab: chrome.tabs.Tab | null
  setup: () => Promise<void>
  teardown: () => void
}

// This is needed because in order to mock the tabs functions in tests
// if the file is immediately evaluated the mock is not present
export const createStore = () =>
  create<TabStore>()((set, get) => {
    const tabs = getTabs()
    return {
      onUpdated: (_: number, __: chrome.tabs.Tab, tab: chrome.tabs.Tab) => {
        set({ currentTab: tab })
      },
      currentTab: null,
      async setup() {
        if (tabs) {
          tabs.onUpdated.addListener(get().onUpdated)
          const [activeTab] = await tabs.query({ active: true })
          set({ currentTab: activeTab })
        }
      },
      async teardown() {
        if (tabs) {
          tabs.onUpdated.removeListener(get().onUpdated)
        }
      }
    }
  })

export const useTabStore = createStore()
