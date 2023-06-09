import React from 'react'
import JSONRPCClient from '../../lib/json-rpc-client'
import JSONRPCServer from '../../lib/json-rpc-server'

export interface JsonRpcContextShape {
  client: JSONRPCClient
  server: JSONRPCServer
}

export const JsonRpcContext = React.createContext<JsonRpcContextShape | undefined>(undefined)

export function useJsonRpcClient() {
  const context = React.useContext(JsonRpcContext)
  if (context === undefined) {
    throw new Error('useJsonRpcClient must be used within JsonRPCProvider')
  }
  return context
}
