import { create } from 'zustand'
import { vegaOrder } from '@vegaprotocol/rest-clients/dist/trading-data'
import { SendMessage } from '../contexts/json-rpc/json-rpc-provider.tsx'
import { RpcMethods } from '../lib/client-rpc-methods.ts'

export type OrdersStore = {
  loading: boolean
  error: Error | null
  lastUpdated: number | null
  getOrderById: (id: string, request: SendMessage) => Promise<vegaOrder | undefined>
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  loading: false,
  error: null,
  lastUpdated: null,
  async getOrderById(id: string, request: SendMessage) {
    try {
      set({ loading: true, error: null, lastUpdated: null })
      const response = await request(RpcMethods.Fetch, { path: `api/v2/order/${id}` }, true)
      const order = response.order

      if (!order) {
        set({ error: new Error(`Order with id ${id} not found`), lastUpdated: null })
        return
      }

      return order
    } catch (error) {
      set({ error: error as Error })
    } finally {
      set({ loading: false, lastUpdated: Date.now() })
    }
  }
}))
