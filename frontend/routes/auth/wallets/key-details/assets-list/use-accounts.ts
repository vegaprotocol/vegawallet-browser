import { useEffect } from 'react'
import { useJsonRpcClient } from '../../../../../contexts/json-rpc/json-rpc-context'
import { useAccountsStore } from './accounts-store'

export const useAccounts = (publicKey: string) => {
  const { request } = useJsonRpcClient()
  const { startPoll, stopPoll, reset, fetchParty, accountsByAsset } = useAccountsStore((state) => ({
    startPoll: state.startPoll,
    stopPoll: state.stopPoll,
    reset: state.reset,
    fetchParty: state.fetchAccounts,
    accountsByAsset: state.accountsByAsset
  }))
  useEffect(() => {
    fetchParty(publicKey, request)
    startPoll(publicKey, request)
    return () => {
      stopPoll()
      reset()
    }
  }, [fetchParty, publicKey, request, reset, startPoll, stopPoll])
  return {
    accountsByAsset
  }
}
