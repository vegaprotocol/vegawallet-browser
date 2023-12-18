import { useNetworksStore } from '@/stores/networks-store'

import { Dropdown } from '../dropdown'
import { NetworksList } from '../networks-list'

export const locators = {
  networkSwitcher: 'network-switcher'
}

export const NetworkSwitcher = () => {
  const { networks, selectedNetwork, setSelectedNetwork } = useNetworksStore((state) => ({
    networks: state.networks,
    selectedNetwork: state.selectedNetwork,
    setSelectedNetwork: state.setSelectedNetwork
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
        trigger={selectedNetwork.name}
        content={() => <NetworksList networks={networks} onClick={(n) => setSelectedNetwork(n.id)} />}
      />
    </div>
  )
}
