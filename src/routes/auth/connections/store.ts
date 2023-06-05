import { create } from 'zustand'
import JSONRPCClient from '../../../lib/json-rpc-client'
import { RpcMethods } from '../../../lib/client-rpc-methods'

export interface Connection {
  allowList: AllowList
  origin: string
}

export interface AllowList {
  publicKeys: any[]
  wallets: string[]
}

export type ConnectionsStore = {
  connections: Connection[]
  loading: boolean
  error: string | null
  loadConnections: (client: JSONRPCClient) => void
}

export const useConnectionStore = create<ConnectionsStore>()((set, get) => ({
  connections: [],
  loading: true,
  error: null,
  loadConnections: async (client: JSONRPCClient) => {
    try {
      set({ loading: true, error: null })
      const { connections } = await client.request(RpcMethods.ListConnections, null)
      set({ connections })
    } catch (e) {
      set({ error: e?.toString() || 'Something went wrong' })
    } finally {
      set({ loading: false })
    }
  }
}))
