import { create } from 'zustand'

// @ts-ignore
const getTabs = () => globalThis.browser?.tabs ?? globalThis.chrome?.tabs

export type TabStore = {
  onTabUpdated: any
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
      onTabUpdated: async (_: number, __: chrome.tabs.Tab, tab: chrome.tabs.Tab) => {
        const [activeTab] = await tabs.query({ active: true })
        set({ currentTab: activeTab })
      },
      currentTab: null,
      async setup() {
        if (tabs) {
          tabs.onActivated.addListener(get().onTabUpdated)
          const [activeTab] = await tabs.query({ active: true })
          set({ currentTab: activeTab })
        }
      },
      async teardown() {
        if (tabs) {
          tabs.onUpdated.removeListener(get().onTabUpdated)
        }
      }
    }
  })

export const useTabStore = createStore()
