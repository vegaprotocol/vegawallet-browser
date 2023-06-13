import { create } from 'zustand'
import JSONRPCClient from '../../lib/json-rpc-client'
import { RpcMethods } from '../lib/client-rpc-methods'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'

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
  addConnection: (connection: Connection) => void
  setConnections: (connections: Connection[]) => void
}

export const useConnectionStore = create<ConnectionsStore>()((set, get) => ({
  connections: [],
  loading: true,
  error: null,
  setConnections: (connections: Connection[]) => {
    set({ connections: sortBy(uniq(connections), 'origin') })
  },
  addConnection: (connection: Connection) => {
    const newConnections = [...get().connections, connection]
    get().setConnections(newConnections)
  },
  loadConnections: async (client: JSONRPCClient) => {
    try {
      set({ loading: true, error: null })
      const { connections } = await client.request(RpcMethods.ListConnections, null)
      get().setConnections(connections)
    } catch (e) {
      set({ error: e?.toString() || 'Something went wrong' })
    } finally {
      set({ loading: false })
    }
  }
}))
