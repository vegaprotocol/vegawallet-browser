import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { AsyncRenderer } from '@/components/async-renderer'
import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { useConnectionStore } from '@/stores/connections'

export const ConnectionsIndex = () => {
  const { request } = useJsonRpcClient()
  const { loading, loadConnections } = useConnectionStore((state) => ({
    loading: state.loading,
    loadConnections: state.loadConnections
  }))
  useEffect(() => {
    loadConnections(request)
  }, [request, loadConnections])
  return <AsyncRenderer loading={loading} render={() => <Outlet />} />
}
