import { Outlet } from 'react-router-dom'
import { NavBar } from '../../components/navbar'
import { VegaIcon } from '../../components/icons/vega-icon'
import { networkIndicator } from '../../locator-ids'

import { ConnectionModal } from '../../components/connection-modal'
import { TransactionModal } from '../../components/transaction-modal'
import { PageHeader } from '../../components/page-header'

export const Auth = () => {
  return (
    <div className="h-full w-full grid grid-rows-[1fr_min-content] overflow-y-scroll">
      <ConnectionModal />
      <TransactionModal />
      <section className="w-full h-full overflow-y-scroll pt-3 px-5 bg-vega-dark-100">
        <PageHeader />
        <Outlet />
      </section>
      <NavBar isFairground={false} />
    </div>
  )
}
