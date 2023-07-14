import { useCallback, useEffect, useState } from 'react'
import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'
import { FULL_ROUTES } from '../../routes/route-names'
import { LOCATION_KEY } from '../persist-location'
import { useGlobalsStore } from '../../stores/globals'
import { getExtensionApi } from '../../lib/extension-apis'
import { SUGGESTED_MNEMONIC_KEY } from '../suggest-mnemonic'

export const useGetRedirectPath = () => {
  const [result, setResult] = useState<{
    loading: boolean
    path: string | null
  }>({
    loading: true,
    path: null
  })
  const { request } = useJsonRpcClient()
  const { loadGlobals, loading, globals } = useGlobalsStore((state) => ({
    loadGlobals: state.loadGlobals,
    loading: state.loading,
    globals: state.globals
  }))
  useEffect(() => {
    loadGlobals(request)
  }, [request, loadGlobals])

  const getRedirectPath = useCallback(async () => {
    const {
      storage: { session }
    } = getExtensionApi()
    const savedMnemonic = await session.get(SUGGESTED_MNEMONIC_KEY)
    const hasSavedMnemonic = savedMnemonic[SUGGESTED_MNEMONIC_KEY]
    // If loading then we do not know where to redirect to yet
    if (loading || !globals) {
      setResult({
        loading: true,
        path: null
      })
    } else if (!globals.passphrase) {
      // If the user has no passphrase set redirect to the get started page
      setResult({
        loading: false,
        path: FULL_ROUTES.getStarted
      })
      // If the user has a passphrase but the wallet is locked then redirect to the login page
    } else if (globals.locked) {
      setResult({
        loading: false,
        path: FULL_ROUTES.login
      })
      // If the user has a passphrase and the app is unlocked but and has no wallets created but does have a saved mnemonic redirect to the save mnemonic page
    } else if (!globals.wallet && hasSavedMnemonic) {
      setResult({
        loading: false,
        path: FULL_ROUTES.saveMnemonic
      })
      // If the user has a passphrase and the app is unlocked but has no wallets redirect to the create wallets page
    } else if (!globals.wallet) {
      setResult({
        loading: false,
        path: FULL_ROUTES.createWallet
      })
    } else if (globals.settings.telemetry === null || globals.settings.telemetry === undefined) {
      setResult({
        loading: false,
        path: FULL_ROUTES.telemetry
      })
    } else {
      // If the user has a path they were previously on then redirect to that
      const path = localStorage.getItem(LOCATION_KEY)
      setResult({
        loading: false,
        path: path ?? FULL_ROUTES.wallets
      })
    }
  }, [globals, loading])

  useEffect(() => {
    getRedirectPath()
  }, [getRedirectPath])

  return result
}
