import { useCallback, useEffect, useState } from 'react'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '../../../lib/client-rpc-methods'
import { getExtensionApi } from '../../../lib/extension-apis'

export const SUGGESTED_MNEMONIC_KEY = 'suggested-mnemonic'

export const usePersistedSuggestMnemonic = () => {
  const {
    storage: { session }
  } = getExtensionApi()
  const { request } = useJsonRpcClient()
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const suggestMnemonic = useCallback(async () => {
    const res = await request(RpcMethods.GenerateRecoveryPhrase, null)
    const { recoveryPhrase } = res
    await session.set({
      [SUGGESTED_MNEMONIC_KEY]: recoveryPhrase
    })
    setMnemonic(recoveryPhrase)
  }, [request, session])

  const getMnemonic = useCallback(async () => {
    const res = await session.get(SUGGESTED_MNEMONIC_KEY)
    const recoveryPhrase = res[SUGGESTED_MNEMONIC_KEY]
    // If one exists in memory then use it, otherwise generate a new one
    if (recoveryPhrase) {
      setMnemonic(recoveryPhrase)
    } else {
      suggestMnemonic()
    }
  }, [session, suggestMnemonic])

  // Clears the mnemonic from memory after the wallet has been created
  const clearMnemonic = () => {
    session.remove(SUGGESTED_MNEMONIC_KEY)
  }

  useEffect(() => {
    getMnemonic()
  }, [getMnemonic])

  return {
    mnemonic,
    clearMnemonic
  }
}
