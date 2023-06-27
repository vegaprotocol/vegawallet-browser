import { create } from 'zustand'
import { RpcMethods } from '../lib/client-rpc-methods'
import JSONRPCClient from '../../lib/json-rpc-client'

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
    telemetry: boolean
  }
}

export type GlobalsStore = {
  globals: AppGlobals | null
  loading: boolean
  error: string | null
  loadGlobals: (client: JSONRPCClient) => Promise<void>
}

export const useGlobalsStore = create<GlobalsStore>()((set, get) => ({
  globals: null,
  loading: true,
  error: null,
  loadGlobals: async (client: JSONRPCClient) => {
    try {
      set({ loading: true, error: null })
      const res = await client.request(RpcMethods.AppGlobals, null)
      set({ globals: res })
    } catch (e) {
      set({ error: e?.toString() || 'Something went wrong' })
    } finally {
      set({ loading: false })
    }
  }
}))
