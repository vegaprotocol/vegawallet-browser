import { VegaIcon } from '../icons/vega-icon'
import config from '../../lib/config'
import { ExpandIcon } from '../icons/expand'
import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'
import { useCallback } from 'react'
import { RpcMethods } from '../../lib/client-rpc-methods'

export const locators = {
  pageHeader: 'page-header',
  networkIndicator: 'network-indicator',
  openPopoutButton: 'open-popout-button'
}

const useOpenInNewWindow = () => {
  const { client } = useJsonRpcClient()

  return useCallback(async () => {
    await client.request(RpcMethods.OpenPopout, null)
    if (config.closeWindowOnPopupOpen) {
      window.close()
    }
  }, [client])
}

export const PageHeader = () => {
  const open = useOpenInNewWindow()
  return (
    <div
      data-testid={locators.pageHeader}
      className="p-3 flex justify-between items-center border-b border-1 border-vega-dark-150"
    >
      <VegaIcon size={40} backgroundColor="none" />
      <div className="flex justify-between items center">
        <div
          data-testid={locators.networkIndicator}
          className="flex flex-col justify-center border rounded-md border-vega-dark-300 text-sm px-2 h-6"
        >
          {config.network.name}
        </div>
        <button
          data-testid={locators.openPopoutButton}
          onClick={open}
          className="border rounded-md border-vega-dark-300 text-sm h-6 ml-3 px-1"
        >
          <ExpandIcon />
        </button>
      </div>
    </div>
  )
}
