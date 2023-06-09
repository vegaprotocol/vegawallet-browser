import { useEffect } from 'react'
import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'
import { useHomeStore } from '../../routes/home/store'
import { FULL_ROUTES } from '../../routes/route-names'
import { LOCATION_KEY } from '../persist-location'

export const useGetRedirectPath = () => {
  const { client } = useJsonRpcClient()
  const { loadGlobals, loading, error, globals } = useHomeStore((state) => ({
    loadGlobals: state.loadGlobals,
    loading: state.loading,
    error: state.error,
    globals: state.globals
  }))
  useEffect(() => {
    loadGlobals(client)
  }, [client, loadGlobals])

  // If loading then we do not know where to redirect to yet
  if (loading) {
    return {
      loading: true,
      error: null,
      path: null
    }
    // If there is an error handle this case
  } else if (error) {
    return {
      loading: false,
      error: error,
      path: null
    }
    // If the user has no passphrase set redirect to the get started page
  } else if (!globals?.passphrase) {
    return {
      loading: false,
      error: null,
      path: FULL_ROUTES.getStarted
    }
    // If the user has a passphrase but the wallet is locked then redirect to the login page
  } else if (globals?.locked) {
    return {
      loading: false,
      error: null,
      path: FULL_ROUTES.login
    }
    // If the user has a passphrase and the app is unlocked but has no wallets redirect to the create wallets page
  } else if (!globals.wallet) {
    return {
      loading: false,
      error: null,
      path: FULL_ROUTES.createWallet
    }
  } else {
    // If the user has a path they were previously on then redirect to that
    const path = localStorage.getItem(LOCATION_KEY)
    return {
      loading: false,
      error: null,
      path: path || FULL_ROUTES.wallets
    }
  }
}
