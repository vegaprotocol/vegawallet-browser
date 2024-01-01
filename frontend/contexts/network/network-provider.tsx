import { useGlobalsStore } from '@/stores/globals'
import { useInteractionStore } from '@/stores/interaction-store'
import { useNetworksStore } from '@/stores/networks-store'

import { NetworkContext } from './network-context'

export const useSelectedNetwork = () => {
  const { networks } = useNetworksStore((store) => ({
    networks: store.networks
  }))
  const { globals } = useGlobalsStore((store) => ({
    globals: store.globals
  }))
  const selectedNetworkId = globals?.settings.selectedNetwork
  const selectedNetwork = networks.find(({ id }) => id === selectedNetworkId)
  if (!selectedNetwork) throw new Error(`Could not find selected network ${selectedNetworkId}`)
  return selectedNetwork
}

export const useNetworkFromChainId = (chainId: string | null) => {
  const { networks } = useNetworksStore((store) => ({
    networks: store.networks
  }))
  if (!chainId) return null
  const network = networks.find((n) => n.chainId === chainId)
  return network
}

export const JsonRPCProvider = ({ children }: { children: JSX.Element }) => {
  const { transactionModalOpen, connectionModalOpen, currentConnectionDetails, currentTransactionDetails } =
    useInteractionStore((store) => ({
      transactionModalOpen: store.transactionModalOpen,
      connectionModalOpen: store.connectionModalOpen,
      currentConnectionDetails: store.currentConnectionDetails,
      currentTransactionDetails: store.currentTransactionDetails
    }))
  const selectedNetwork = useSelectedNetwork()
  const networkFromChainId = useNetworkFromChainId(
    currentConnectionDetails?.chainId ?? currentTransactionDetails?.chainId
  )
  const interactionMode = transactionModalOpen || connectionModalOpen
  if (interactionMode && !networkFromChainId) {
    throw new Error('Could not find network from chainId')
  }
  // If interaction mode is true then the above if ensures that networkFromChainId is always defined
  const value = interactionMode ? networkFromChainId! : selectedNetwork

  return <NetworkContext.Provider value={{ network: value }}>{children}</NetworkContext.Provider>
}
