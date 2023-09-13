import { create } from 'zustand'
import { RpcMethods } from '../lib/client-rpc-methods.ts'
import { SendMessage } from '../contexts/json-rpc/json-rpc-provider.tsx'
import type { Market } from '@vegaprotocol/types'

export type MarketsStore = {
  markets: Market[] | null
  loading: boolean
  error: string | null
  fetchMarkets: (request: SendMessage) => Promise<void>
}

export const useMarketsStore = create<MarketsStore>((set, get) => ({
  markets: null,
  loading: false,
  error: null,
  async fetchMarkets(request) {
    try {
      set({ loading: true, error: null })
      const markets = await request(RpcMethods.Fetch, { path: 'api/v2/markets' })
      set({ markets })
    } catch (error) {
      set({ error: 'Failed to fetch markets' })
    } finally {
      set({ loading: false })
    }
  }
}))
