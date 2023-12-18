import { create } from 'zustand'

import { SendMessage } from '@/contexts/json-rpc/json-rpc-provider.tsx'
import { RpcMethods } from '@/lib/client-rpc-methods.ts'

interface Network {
  name: string
  rest: string[]
  explorer: string
  // TODO needed?
  probing: boolean
  preferredNode: string | null
}

interface NetworksResponse {
  networks: Network[]
}

export type NetworksStore = {
  networks: Network[]
  loading: boolean
  loadNetworks: (request: SendMessage<NetworksResponse>) => Promise<void>
}

export const useNetworksStore = create<NetworksStore>((set, get) => ({
  networks: [],
  loading: true,
  async loadNetworks(request) {
    try {
      const { networks } = await request(RpcMethods.ListNetworks)
      set({ networks })
    } finally {
      set({ loading: false })
    }
  }
}))
