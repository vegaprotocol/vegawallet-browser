import { networkIndicator } from '../../locator-ids'
import { VegaIcon } from '../icons/vega-icon'
import locators from '../locators'
import config from '../../lib/config'
import { ExpandIcon } from '../icons/expand'

export const PageHeader = () => {
  return (
    <>
      <div
        data-testid={locators.pageHeader}
        className="p-3 flex justify-between items-center border-b border-1 border-vega-dark-150"
      >
        <VegaIcon size={40} backgroundColor="none" />
        <div className="flex justify-between items center">
          <div
            data-testid={networkIndicator}
            className="flex flex-col justify-center border rounded-md border-vega-dark-300 text-sm px-2 h-6"
          >
            {config.network.name}
          </div>
          <button className="border rounded-md border-vega-dark-300 text-sm h-6 ml-3 px-1">
            <ExpandIcon />
          </button>
        </div>
      </div>
    </>
  )
}
