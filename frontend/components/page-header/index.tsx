import config from '!/config'
import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '@/lib/client-rpc-methods'
import { useGlobalsStore } from '@/stores/globals'
import { usePopoverStore } from '@/stores/popover-store'

import { Cross } from '../icons/cross'
import { ExpandIcon } from '../icons/expand'
import { VegaIcon } from '../icons/vega-icon'

export const locators = {
  pageHeader: 'page-header',
  networkIndicator: 'network-indicator',
  openPopoutButton: 'open-popout-button'
}

const useOpenInNewWindow = () => {
  const { request } = useJsonRpcClient()

  return async () => {
    await request(RpcMethods.OpenPopout, null)
    if (config.closeWindowOnPopupOpen) {
      window.close()
    }
  }
}

export const PageHeader = () => {
  const { isMobile } = useGlobalsStore((state) => ({
    isMobile: state.isMobile
  }))
  const { isPopoverInstance, focusPopover } = usePopoverStore((state) => ({
    isPopoverInstance: state.isPopoverInstance,
    focusPopover: state.focusPopover
  }))
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
        {config.features?.popoutHeader && !isMobile ? (
          <button
            data-testid={locators.openPopoutButton}
            onClick={isPopoverInstance ? focusPopover : open}
            className="border rounded-md border-vega-dark-300 text-sm h-6 ml-3 px-1"
          >
            {isPopoverInstance ? (
              <Cross className="h-4 w-4 flex justify-between items-center" />
            ) : (
              <ExpandIcon size={16} />
            )}
          </button>
        ) : null}
      </div>
    </div>
  )
}
