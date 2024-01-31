import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { useNetwork } from '@/contexts/network/network-context'
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

const NetworkDropdown = () => {
  const { request } = useJsonRpcClient()
  const { networks, setSelectedNetwork } = useNetworksStore((state) => ({
    networks: state.networks,
    setSelectedNetwork: state.setSelectedNetwork
  }))
  const { network } = useNetwork()
  const { loadGlobals } = useGlobalsStore((state) => ({
    loadGlobals: state.loadGlobals
  }))

  return (
    <Dropdown
      enabled={networks.length > 1}
      trigger={<div data-testid={locators.networkSwitcherCurrentNetwork}>{network.name}</div>}
      content={() => (
        <div>
          <Header content="Select a network to view" />
          <p data-testid={locators.networkSwitcherMessage} className="text-vega-dark-300 mt-4">
            Your selected network is for display purposes only, you can connect and place transactions on any configured
            network regardless of what network you have selected.
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
  )
}

export const NetworkSwitcher = () => {
  const { interactionMode, network } = useNetwork()

  return (
    <div
      data-testid={locators.networkSwitcher}
      className="flex flex-col justify-center border rounded-md text-sm px-2 h-6"
      style={{ borderColor: network.secondaryColor, color: network.secondaryColor }}
    >
      {interactionMode ? <div>{network.name}</div> : <NetworkDropdown />}
    </div>
  )
}
