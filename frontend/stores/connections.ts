import { create } from 'zustand'
import { RpcMethods } from '../lib/client-rpc-methods'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import { SendMessage } from '../contexts/json-rpc/json-rpc-provider'

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
  loadConnections: (request: SendMessage) => void
  addConnection: (connection: Connection) => void
  setConnections: (connections: Connection[]) => void
}

export const useConnectionStore = create<ConnectionsStore>()((set, get) => ({
  connections: [],
  loading: true,
  setConnections: (connections: Connection[]) => {
    set({ connections: sortBy(uniqBy(connections, 'origin'), 'origin') })
  },
  addConnection: (connection: Connection) => {
    const newConnections = [...get().connections, connection]
    get().setConnections(newConnections)
  },
  loadConnections: async (request: SendMessage) => {
    try {
      set({ loading: true })
      const { connections } = await request(RpcMethods.ListConnections)
      get().setConnections(connections)
    } finally {
      set({ loading: false })
    }
  }
}))
