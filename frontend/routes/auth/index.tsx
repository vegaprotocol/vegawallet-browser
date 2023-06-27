import { Outlet } from 'react-router-dom'
import { NavBar } from '../../components/navbar'

import { ConnectionModal } from '../../components/connection-modal'
import { TransactionModal } from '../../components/transaction-modal'
import { PageHeader } from '../../components/page-header'
import { useWalletStore } from './wallets/store'
import { useEffect } from 'react'
import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'

export const Auth = () => {
  const { client } = useJsonRpcClient()
  const { loadWallets } = useWalletStore((state) => ({
    loadWallets: state.loadWallets
  }))
  useEffect(() => {
    loadWallets(client)
  }, [client, loadWallets])
  return (
    <div className="h-full w-full grid grid-rows-[1fr_min-content] overflow-y-auto">
      <ConnectionModal />
      <TransactionModal />
      <section className="w-full h-full overflow-y-auto pt-3 px-5 bg-vega-dark-100">
        <PageHeader />
        <Outlet />
      </section>
      <NavBar isFairground={false} />
    </div>
  )
}
