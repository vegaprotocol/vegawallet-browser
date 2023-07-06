import type JSONRPCClient from '../lib/json-rpc-client'
import type JSONRPCServer from '../lib/json-rpc-server'

declare global {
  interface Window {
    client: JSONRPCClient
    server: JSONRPCServer
    request: SendMessage
    vega: any
    sendTransactionResult: any
    connectWalletResult: any
  }
}
