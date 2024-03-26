import { getIntentBackground, Intent, Tooltip } from '@vegaprotocol/ui-toolkit'
import classNames from 'classnames'

import { useNetwork } from '@/contexts/network/network-context'
import { useConnectionStore } from '@/stores/connections'
import { useTabStore } from '@/stores/tab-store'

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

const IndicatorWithTooltip = ({ intent, description }: { description: string; intent: Intent }) => {
  return (
    <Tooltip description={description}>
      <span>
        <Indicator intent={intent} />
      </span>
    </Tooltip>
  )
}

export const NetworkIndicator = () => {
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
        <IndicatorWithTooltip intent={Intent.Success} description={`You are currently connected to ${origin}.`} />
      ) : (
        <IndicatorWithTooltip
          intent={Intent.Warning}
          description={`You are connected to ${origin}, however you are currently viewing data for a different network. To view data for the network you are connected to select a different network in the network switcher.`}
        />
      )
    }
    return <IndicatorWithTooltip intent={Intent.None} description={`You are not currently connected to ${origin}.`} />
  }
  return <IndicatorWithTooltip intent={Intent.None} description={`You are not currently connected to any sites.`} />
}
