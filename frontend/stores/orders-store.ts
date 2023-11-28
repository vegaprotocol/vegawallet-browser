import { vegaOrder } from '@vegaprotocol/rest-clients/dist/trading-data'
import { create } from 'zustand'

import { SendMessage } from '@/contexts/json-rpc/json-rpc-provider.tsx'
import { RpcMethods } from '@/lib/client-rpc-methods.ts'

export type OrdersStore = {
  loading: boolean
  error: Error | null
  lastUpdated: number | null
  order: vegaOrder | null
  getOrderById: (id: string, request: SendMessage) => Promise<void>
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  loading: false,
  error: null,
  lastUpdated: null,
  order: null,
  async getOrderById(id: string, request: SendMessage) {
    try {
      set({ loading: true, error: null, lastUpdated: null })
      const response = await request(RpcMethods.Fetch, { path: `api/v2/order/${id}` }, true)
      const order = response.order

      set({ order })
    } catch (error) {
      set({ error: error as Error })
    } finally {
      set({ loading: false, lastUpdated: Date.now() })
    }
  }
}))
