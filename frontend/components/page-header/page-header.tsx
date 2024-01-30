import { VegaIcon } from '../icons/vega-icon'
import { NetworkSwitcher } from './network-switcher'
import { PopoutButton } from './popout-button'

export const locators = {
  pageHeader: 'page-header'
}

export const PageHeader = () => {
  return (
    <div
      data-testid={locators.pageHeader}
      className="p-3 flex justify-between items-center border-b border-1 border-vega-dark-150"
    >
      <VegaIcon size={40} backgroundColor="none" />
      <div className="flex justify-between items center">
        <NetworkSwitcher />
        <PopoutButton />
      </div>
    </div>
  )
}
