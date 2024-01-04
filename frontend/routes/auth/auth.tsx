import { useEffect } from 'react'
import { Outlet, useMatch } from 'react-router-dom'

import { DappsHeader } from '@/components/dapps-header/dapps-header'
import { ModalWrapper } from '@/components/modals'
import { NavBar } from '@/components/navbar'
import { PageHeader } from '@/components/page-header'
import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { useAssetsStore } from '@/stores/assets-store'
import { useMarketsStore } from '@/stores/markets-store'
import { useNetworksStore } from '@/stores/networks-store'
import { useWalletStore } from '@/stores/wallets'

import { FULL_ROUTES } from '../route-names'

export const Auth = () => {
  const { request } = useJsonRpcClient()

  // Wallets store
  const { loadWallets, loading: loadingWallets } = useWalletStore((state) => ({
    loadWallets: state.loadWallets,
    loading: state.loading
  }))

  // Networks store
  const { loadNetworks, loading: loadingNetworks } = useNetworksStore((state) => ({
    loadNetworks: state.loadNetworks,
    loading: state.loading
  }))

  const loading = loadingWallets || loadingNetworks

  // Assets store
  const { loadAssets } = useAssetsStore((state) => ({
    loadAssets: state.fetchAssets
  }))

  // Markets store
  const { loadMarkets } = useMarketsStore((state) => ({
    loadMarkets: state.fetchMarkets
  }))

  useEffect(() => {
    loadNetworks(request)
    loadWallets(request)
  }, [request, loadWallets, loadNetworks])

  // TODO: Remove
  // HACK: This is work around to ensure that the wallets are loaded before network requests.
  // Ideally the backend should be capable of doing this in parallel, but increases perceived performance for now.
  useEffect(() => {
    if (!loading) {
      loadAssets(request)
      loadMarkets(request)
    }
  }, [loadAssets, loadMarkets, loading, request])

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
