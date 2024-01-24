import { createContext, useContext } from 'react'

import JSONRPCClient from '../../../lib/json-rpc-client'
import JSONRPCServer from '../../../lib/json-rpc-server'
import { SendMessage } from './json-rpc-provider'

export interface JsonRpcContextShape {
  client: JSONRPCClient
  server: JSONRPCServer
  request: SendMessage
}

export const JsonRpcContext = createContext<JsonRpcContextShape | undefined>(undefined)

export function useJsonRpcClient() {
  const context = useContext(JsonRpcContext)
  if (context === undefined) {
    throw new Error('useJsonRpcClient must be used within JsonRPCProvider')
  }
  return context
}
