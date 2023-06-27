import { Outlet } from 'react-router-dom'
import { NavBar } from '../../components/navbar'

import { ConnectionModal } from '../../components/connection-modal'
import { TransactionModal } from '../../components/transaction-modal'
import { PageHeader } from '../../components/page-header'
import { useEffect } from 'react'
import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'
import { useWalletStore } from '../../stores/wallets'

export const Auth = () => {
  const { request } = useJsonRpcClient()
  const { loadWallets } = useWalletStore((state) => ({
    loadWallets: state.loadWallets
  }))
  useEffect(() => {
    loadWallets(request)
  }, [request, loadWallets])
  return (
    <div className="h-full w-full grid grid-rows-[1fr_min-content] overflow-y-auto bg-vega-dark-100">
      <ConnectionModal />
      <TransactionModal />
      <PageHeader />
      <section className="w-full h-full overflow-y-auto pt-3 px-5">
        <Outlet />
      </section>
      <NavBar isFairground={false} />
    </div>
  )
}
