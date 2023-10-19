import { create } from 'zustand'
import { vegaOrder } from '@vegaprotocol/rest-clients/dist/trading-data'
import { SendMessage } from '../contexts/json-rpc/json-rpc-provider.tsx'
import { RpcMethods } from '../lib/client-rpc-methods.ts'

export type OrdersStore = {
  loading: boolean
  getOrderById: (id: string, request: SendMessage) => Promise<{ order: vegaOrder; lastUpdated: number }>
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  loading: false,
  async getOrderById(id: string, request: SendMessage) {
    try {
      set({ loading: true })
      const response = await request(RpcMethods.Fetch, { path: `api/v2/order/${id}` })
      const order = response.order

      if (!order) {
        throw new Error(`Order with id ${id} not found`)
      }

      return {
        order,
        lastUpdated: Date.now()
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch order: ${error.message}`)
      }
      throw new Error('Failed to fetch order')
    } finally {
      set({ loading: false })
    }
  }
}))
