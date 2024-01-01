import { create } from 'zustand'

import { SendMessage } from '@/contexts/json-rpc/json-rpc-provider.tsx'
import { RpcMethods } from '@/lib/client-rpc-methods.ts'
import { Network } from '@/types/backend'

interface NetworksResponse {
  networks: Network[]
}

export type NetworksStore = {
  networks: Network[]
  loading: boolean
  selectedNetwork: Network | null
  loadNetworks: (request: SendMessage) => Promise<void>
  setSelectedNetwork: (request: SendMessage, newSelectedNetwork: string) => void
  getNetworkById: (networkId: string) => Network | undefined
}

export const useNetworksStore = create<NetworksStore>((set, get) => ({
  networks: [],
  loading: true,
  selectedNetwork: null,
  async loadNetworks(request) {
    try {
      const { networks } = (await request(RpcMethods.ListNetworks)) as NetworksResponse
      const globals = await request(RpcMethods.AppGlobals)
      const selectedNetworkId = globals.settings.selectedNetwork
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
  async setSelectedNetwork(request, newSelectedNetwork) {
    const selectedNetwork = get().networks.find(({ id }) => id === newSelectedNetwork)
    if (!selectedNetwork) {
      throw new Error('Attempted to set selected network to a network that could not be found')
    }
    await request(RpcMethods.UpdateSettings, { selectedNetwork: newSelectedNetwork })
    set({ selectedNetwork })
  }
}))
