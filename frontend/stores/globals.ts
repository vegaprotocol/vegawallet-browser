import { create } from 'zustand'
import { RpcMethods } from '../lib/client-rpc-methods'
import { SendMessage } from '../contexts/json-rpc/json-rpc-provider'

export interface AppGlobals {
  // Has the user set a passphrase
  passphrase: boolean
  // Does the user have any wallet (imported or created)
  wallet: boolean
  // Extension version
  version: string
  // Is the app currently locked?
  locked: boolean
  // Mutable settings, see below
  settings: {
    [key: string]: boolean | string | number | undefined
  }
}

export type GlobalsStore = {
  globals: AppGlobals | null
  loading: boolean
  settingsLoading: boolean
  loadGlobals: (request: SendMessage) => Promise<void>
  saveSettings: (request: SendMessage, settings: AppGlobals['settings']) => Promise<void>
}

export const useGlobalsStore = create<GlobalsStore>()((set, get) => ({
  globals: null,
  loading: true,
  settingsLoading: false,
  error: null,
  loadGlobals: async (request: SendMessage) => {
    try {
      set({ loading: true })
      const res = await request(RpcMethods.AppGlobals, null)
      set({ globals: res })
    } finally {
      set({ loading: false })
    }
  },
  saveSettings: async (request: SendMessage, settings: AppGlobals['settings']) => {
    try {
      set({ settingsLoading: true })
      await request(RpcMethods.UpdateSettings, settings)
      await get().loadGlobals(request)
    } finally {
      set({ settingsLoading: false })
    }
  }
}))
