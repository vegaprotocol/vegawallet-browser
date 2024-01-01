import { Outlet } from 'react-router-dom'

import { useWalletStore } from '@/stores/wallets'

export const WalletsRoot = () => {
  const { loading } = useWalletStore((store) => ({
    loading: store.loading
  }))
  // TODO remove this now we are requiring wallets to be loaded at auth

  if (loading) return null
  return <Outlet />
}
