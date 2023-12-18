import { useNetworksStore } from '@/stores/networks-store'

import { Dropdown } from '../dropdown'
import { NetworksList } from '../networks-list'

export const locators = {
  networkSwitcher: 'network-switcher'
}

export const NetworkSwitcher = () => {
  const { networks } = useNetworksStore((state) => ({
    networks: state.networks
  }))
  return (
    <div
      data-testid={locators.networkSwitcher}
      className="flex flex-col justify-center border rounded-md border-vega-dark-300 text-sm mx-2 h-6"
    >
      <Dropdown
        enabled={networks.length > 1}
        trigger={networks[0]?.name}
        content={() => <NetworksList networks={networks} />}
      />
    </div>
  )
}
