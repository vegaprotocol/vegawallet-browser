import { useCallback, useState } from 'react'
import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '../../lib/client-rpc-methods'
import { useGlobalsStore } from '../../stores/globals'

export const useSaveSettings = () => {
  const [loading, setLoading] = useState(false)
  const { request } = useJsonRpcClient()
  const { loadGlobals } = useGlobalsStore((state) => ({
    loadGlobals: state.loadGlobals
  }))
  const save = useCallback(
    async (values: Record<string, any>) => {
      setLoading(true)
      try {
        await request(RpcMethods.UpdateSettings, values)
        // Reload the globals as this contains the settings and these should have changed
        await loadGlobals(request)
      } finally {
        setLoading(false)
      }
    },
    [request, loadGlobals]
  )
  return {
    loading,
    save
  }
}
