import { Outlet } from 'react-router-dom'
import { NavBar } from '../../components/navbar'
import { VegaIcon } from '../../components/icons/vega-icon'
import { networkIndicator } from '../../locator-ids'

export const Auth = () => {
  return (
    <div className="h-full w-full grid grid-rows-[1fr_min-content] overflow-y-scroll">
      <section className="w-full h-full overflow-y-scroll pt-3 px-5 bg-vega-dark-100">
        <div className="flex justify-between items-center mb-10">
          <VegaIcon size={48} backgroundColor="none" />
          <div
            data-testid={networkIndicator}
            className="flex flex-col justify-center border rounded-md border-vega-dark-300 text-sm px-2 h-6"
          >
            {process.env['REACT_APP_ENV_NAME']}
          </div>
        </div>
        <Outlet />
      </section>
      <NavBar isFairground={false} />
    </div>
  )
}
