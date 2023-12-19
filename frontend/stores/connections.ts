import orderBy from 'lodash/orderBy'
import uniqBy from 'lodash/uniqBy'
import { create } from 'zustand'

import { SendMessage } from '@/contexts/json-rpc/json-rpc-provider'
import { RpcMethods } from '@/lib/client-rpc-methods'

export interface Connection {
  allowList: AllowList
  origin: string
  accessedAt: number
  id: string
}

export interface AllowList {
  publicKeys: any[]
  wallets: string[]
}

export type ConnectionsStore = {
  connections: Connection[]
  loading: boolean
  loadConnections: (request: SendMessage) => Promise<void>
  addConnection: (connection: Connection) => void
  setConnections: (connections: Connection[]) => void
  removeConnection: (request: SendMessage, connection: Connection) => Promise<void>
}

export const useConnectionStore = create<ConnectionsStore>()((set, get) => ({
  connections: [],
  loading: true,
  setConnections: (connections: Connection[]) => {
    set({ connections: uniqBy(orderBy(connections, 'accessedAt', 'desc'), 'origin') })
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
  },
  removeConnection: async (request: SendMessage, connection: Connection) => {
    await request(RpcMethods.RemoveConnection, { origin: connection.origin })
    // TODO this should be done with the notification not here!
    set({
      connections: get().connections.filter((c) => c.origin !== connection.origin)
    })
  }
}))
