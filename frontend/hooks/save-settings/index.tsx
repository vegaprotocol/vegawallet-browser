import { useCallback, useState } from 'react'
import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'
import { useHomeStore } from '../../routes/home/store'
import { RpcMethods } from '../../lib/client-rpc-methods'

export const useSaveSettings = () => {
  const [loading, setLoading] = useState(false)
  const { client } = useJsonRpcClient()
  const { loadGlobals } = useHomeStore((state) => ({
    loadGlobals: state.loadGlobals
  }))
  const save = useCallback(
    async (values: Record<string, any>) => {
      setLoading(true)
      try {
        await client.request(RpcMethods.UpdateSettings, values)
        await loadGlobals(client)
      } finally {
        setLoading(false)
      }
    },
    [client, loadGlobals]
  )
  return {
    loading,
    save
  }
}
