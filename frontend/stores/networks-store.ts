import { create } from 'zustand'

import { SendMessage } from '@/contexts/json-rpc/json-rpc-provider.tsx'
import { RpcMethods } from '@/lib/client-rpc-methods.ts'

export const SELECTED_NETWORK_STORAGE_KEY = 'selected-network'

export interface Network {
  id: string
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
  selectedNetwork: Network | null
  loadNetworks: (request: SendMessage<NetworksResponse>) => Promise<void>
  setSelectedNetwork: (newSelectedNetwork: string) => void
  getNetworkById: (networkId: string) => Network | undefined
}

export const useNetworksStore = create<NetworksStore>((set, get) => ({
  networks: [],
  loading: true,
  selectedNetwork: null,
  async loadNetworks(request) {
    try {
      const { networks } = await request(RpcMethods.ListNetworks)
      const selectedNetworkId = localStorage.getItem(SELECTED_NETWORK_STORAGE_KEY) || null
      const network = networks.find(({ id }) => id === selectedNetworkId)
      if (selectedNetworkId && !network) throw new Error(`Could not find selected network ${selectedNetworkId}`)
      set({ networks, selectedNetwork: network ?? networks[0] })
    } finally {
      set({ loading: false })
    }
  },
  getNetworkById(networkId) {
    return get().networks.find(({ id }) => id === networkId)
  },
  setSelectedNetwork(newSelectedNetwork) {
    const selectedNetwork = get().networks.find(({ id }) => id === newSelectedNetwork)
    if (!selectedNetwork) {
      throw new Error('Attempted to set selected network to a network that could not be found')
    }
    console.log(selectedNetwork)
    localStorage.setItem(SELECTED_NETWORK_STORAGE_KEY, newSelectedNetwork)
    set({ selectedNetwork })
  }
}))
