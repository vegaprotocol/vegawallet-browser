import { getIntentBackground, Intent, Tooltip } from '@vegaprotocol/ui-toolkit'
import classNames from 'classnames'

import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { useNetwork } from '@/contexts/network/network-context'
import { useConnectionStore } from '@/stores/connections'
import { useGlobalsStore } from '@/stores/globals'
import { useNetworksStore } from '@/stores/networks-store'
import { useTabStore } from '@/stores/tab-store'

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
  const { loadGlobals, globals } = useGlobalsStore((state) => ({
    loadGlobals: state.loadGlobals,
    globals: state.globals
  }))

  const displayNetworks = networks.filter((n) => globals?.settings.showHiddenNetworks || !n.hidden)

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
            networks={displayNetworks}
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

const Indicator = ({ intent }: { intent: Intent }) => {
  const background = getIntentBackground(intent)
  return (
    <div
      className={classNames(
        'border-1 border-vega-dark-200 border inline-block w-3 h-3 mt-1 mr-2 rounded-full text-black',
        background
      )}
      data-testid="indicator"
    />
  )
}

const IndicatorTooltip = ({ intent, description }: { description: string; intent: Intent }) => {
  return (
    <Tooltip description={description}>
      <span>
        <Indicator intent={intent} />
      </span>
    </Tooltip>
  )
}

const NetworkWarning = () => {
  const { network } = useNetwork()
  const { currentTab } = useTabStore((state) => ({
    currentTab: state.currentTab
  }))
  const { connections, loading } = useConnectionStore((state) => ({
    connections: state.connections,
    loading: state.loading
  }))
  if (loading) return null
  if (currentTab?.url && connections.length > 0) {
    const origin = new URL(currentTab.url).origin
    const connection = connections.find((c) => c.origin === origin)
    if (connection) {
      const chainId = connection?.chainId
      return network.chainId === chainId ? (
        <IndicatorTooltip intent={Intent.Success} description={`You are currently connected to ${origin}.`} />
      ) : (
        <IndicatorTooltip
          intent={Intent.Warning}
          description={`You are connected to ${origin}, however you are currently viewing data for a different network. To view data for the network you are connected to select a different network in the network switcher.`}
        />
      )
    }
    return <IndicatorTooltip intent={Intent.None} description={`You are not currently connected to ${origin}.`} />
  }
  return <IndicatorTooltip intent={Intent.None} description={`You are not currently connected to any sites.`} />
}

export const NetworkSwitcher = () => {
  const { interactionMode, network } = useNetwork()

  return (
    <div className="flex flex-row">
      <div className="flex flex-col justify-center">
        <NetworkWarning />
      </div>
      <div
        data-testid={locators.networkSwitcher}
        className="flex flex-col justify-center border rounded-md text-sm px-2 h-6"
        style={{ borderColor: network.secondaryColor, color: network.secondaryColor }}
      >
        {interactionMode ? <div>{network.name}</div> : <NetworkDropdown />}
      </div>
    </div>
  )
}
