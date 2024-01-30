import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { useGlobalsStore } from '@/stores/globals'
import { useNetworksStore } from '@/stores/networks-store'

import { Dropdown } from '../dropdown'
import { Header } from '../header'
import { NetworksList } from '../networks-list'

export const locators = {
  networkSwitcher: 'network-switcher',
  networkSwitcherCurrentNetwork: 'network-switcher-current-network',
  networkSwitcherMessage: 'network-switcher-message'
}

export const NetworkSwitcher = () => {
  const { request } = useJsonRpcClient()
  const { networks, selectedNetwork, setSelectedNetwork } = useNetworksStore((state) => ({
    networks: state.networks,
    selectedNetwork: state.selectedNetwork,
    setSelectedNetwork: state.setSelectedNetwork
  }))
  const { loadGlobals } = useGlobalsStore((state) => ({
    loadGlobals: state.loadGlobals
  }))
  if (!selectedNetwork)
    throw new Error('Selected network not found when rendering page header. This should not be possible.')
  return (
    <div
      data-testid={locators.networkSwitcher}
      className="flex flex-col justify-center border rounded-md border-vega-dark-300 text-sm px-2 h-6"
    >
      <Dropdown
        enabled={networks.length > 1}
        trigger={<div data-testid={locators.networkSwitcherCurrentNetwork}>{selectedNetwork.name}</div>}
        content={() => (
          <div>
            <Header content="Select a network to view" />
            <p data-testid={locators.networkSwitcherMessage} className="text-vega-dark-300 mt-4">
              Your selected network is for display purposes only, you can connect and place transactions on any
              configured network regardless of what network you have selected.
            </p>
            <NetworksList
              networks={networks}
              onClick={async (n) => {
                await setSelectedNetwork(request, n.id)
                await loadGlobals(request)
              }}
            />
          </div>
        )}
      />
    </div>
  )
}
