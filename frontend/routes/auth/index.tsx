import { Outlet, useMatch } from 'react-router-dom'
import { NavBar } from '../../components/navbar'

import { PageHeader } from '../../components/page-header'
import { ModalWrapper } from '../../components/modals'
import { useEffect } from 'react'
import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'
import { useWalletStore } from '../../stores/wallets'
import { FULL_ROUTES } from '../route-names'
import { DappsHeader } from '../../components/dapps-header/dapps-header'

export const Auth = () => {
  const { request } = useJsonRpcClient()

  // Wallets store
  const { loadWallets } = useWalletStore((state) => ({
    loadWallets: state.loadWallets
  }))

  useEffect(() => {
    loadWallets(request)
  }, [request, loadWallets])

  const isWallets = !!useMatch(FULL_ROUTES.wallets)

  return (
    <div className="h-full w-full grid grid-rows-[min-content_1fr_min-content] bg-vega-dark-100">
      <ModalWrapper />
      <PageHeader />
      <section className="w-full h-full overflow-y-auto">
        {isWallets && <DappsHeader />}
        <div className="px-5 pt-3">
          <Outlet />
        </div>
      </section>
      <NavBar isFairground={false} />
    </div>
  )
}
