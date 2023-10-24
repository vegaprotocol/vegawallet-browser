import { useMemo } from 'react'
import { JsonRpcContext } from './json-rpc-context'
import { useInteractionStore } from '../../stores/interaction-store'
import { createServer } from './hooks/create-server'
import { useCreateClient } from './hooks/create-client'

export type SendMessage = (method: string, params?: any, propagateErrors?: boolean) => Promise<any>

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
