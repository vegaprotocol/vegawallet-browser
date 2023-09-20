import { useEffect, useState } from 'react'
import { useJsonRpcClient } from '../../../../contexts/json-rpc/json-rpc-context'
import { Key, useWalletStore } from '../../../../stores/wallets'
import { useAccountsStore } from './accounts-store'

export const useAccounts = (id: string) => {
  const { request } = useJsonRpcClient()
  const { startPoll, stopPoll, reset, fetchAccounts: fetchParty, accountsByAsset } = useAccountsStore()
  const { getKeyById } = useWalletStore()
  const [key, setKey] = useState<Key>()
  useEffect(() => {
    if (id) {
      fetchParty(id, request)
      startPoll(id, request)
      const key = getKeyById(id)
      setKey(key)
      return () => {
        stopPoll()
        reset()
      }
    }
  }, [fetchParty, getKeyById, id, request, reset, startPoll, stopPoll])
  return {
    accountsByAsset,
    key
  }
}
