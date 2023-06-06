import { networkIndicator } from '../../locator-ids'
import { VegaIcon } from '../icons/vega-icon'
import locators from '../locators'

export const PageHeader = () => {
  return (
    <>
      <div data-testid={locators.pageHeader} className="flex justify-between items-center mb-8">
        <VegaIcon size={48} backgroundColor="none" />
        <div
          data-testid={networkIndicator}
          className="flex flex-col justify-center border rounded-md border-vega-dark-300 text-sm px-2 h-6"
        >
          {process.env.REACT_APP_ENV_NAME}
        </div>
      </div>
    </>
  )
}
