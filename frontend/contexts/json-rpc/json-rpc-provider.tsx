import { useMemo } from 'react'

import { useInteractionStore } from '../../stores/interaction-store'
import { useCreateClient } from './hooks/create-client'
import { createServer } from './hooks/create-server'
import { JsonRpcContext } from './json-rpc-context'

export type SendMessage = (method: string, parameters?: any, propagateErrors?: boolean) => Promise<any>

export interface JsonRpcNotification {
  method: string
  params: any
  jsonrpc: '2.0'
}

/**
 * Provides Vega Ethereum contract instances to its children.
 */
export const JsonRPCProvider = ({ children }: { children: JSX.Element }) => {
  const { client, request } = useCreateClient()
  const { handleConnection, handleTransaction } = useInteractionStore((store) => ({
    handleConnection: store.handleConnection,
    handleTransaction: store.handleTransaction
  }))
  const server = useMemo(() => createServer(handleConnection, handleTransaction), [handleConnection, handleTransaction])
  const value = useMemo(
    () => ({
      client,
      server,
      request
    }),
    [client, request, server]
  )
  return <JsonRpcContext.Provider value={value}>{children}</JsonRpcContext.Provider>
}
