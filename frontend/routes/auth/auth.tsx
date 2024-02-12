import { useEffect } from 'react'
import { Outlet, useMatch } from 'react-router-dom'

import { DappsHeader } from '@/components/dapps-header'
import { ModalWrapper } from '@/components/modals'
import { NavBar } from '@/components/navbar'
import { PageHeader } from '@/components/page-header'
import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { useNetwork } from '@/contexts/network/network-context'
import { useAssetsStore } from '@/stores/assets-store'
import { useMarketsStore } from '@/stores/markets-store'
import { useNetworksStore } from '@/stores/networks-store'
import { useWalletStore } from '@/stores/wallets'

import { FULL_ROUTES } from '../route-names'

export const Auth = () => {
  const { request } = useJsonRpcClient()
  const { network } = useNetwork()

  // Wallets store
  const { loadWallets, loading: loadingWallets } = useWalletStore((state) => ({
    loadWallets: state.loadWallets,
    loading: state.loading
  }))

  // Assets store
  const { loadAssets } = useAssetsStore((state) => ({
    loadAssets: state.fetchAssets
  }))

  // Markets store
  const { loadMarkets } = useMarketsStore((state) => ({
    loadMarkets: state.fetchMarkets
  }))

  // Networks store
  const { loading: loadingNetworks } = useNetworksStore((state) => ({
    loading: state.loading
  }))

  useEffect(() => {
    loadWallets(request)
  }, [request, loadWallets])

  // TODO: Remove
  // HACK: This is work around to ensure that the wallets are loaded before network requests.
  // Ideally the backend should be capable of doing this in parallel, but increases perceived performance for now.
  useEffect(() => {
    if (!loadingNetworks && !loadingWallets) {
      loadAssets(request, network.id)
      loadMarkets(request, network.id)
    }
  }, [loadAssets, loadMarkets, loadingNetworks, loadingWallets, network.id, request])
  const isWallets = !!useMatch(FULL_ROUTES.wallets)

  // Only render the UI if the wallets and networks have loaded
  if (loadingWallets || loadingNetworks) return null

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
      <NavBar />
    </div>
  )
}
