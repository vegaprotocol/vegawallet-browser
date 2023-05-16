import { Outlet } from 'react-router-dom'
import { NavBar } from '../../components/navbar'

import { ConnectionModal } from '../../components/connection-modal'
import { TransactionModal } from '../../components/transaction-modal'

export const Auth = () => {
  return (
    <div className="h-full w-full grid grid-rows-[1fr_min-content] overflow-y-scroll">
      <ConnectionModal />
      <TransactionModal />
      <section className="w-full h-full overflow-y-scroll bg-vega-dark-100">
        <Outlet />
      </section>
      <NavBar isFairground={false} />
    </div>
  )
}
