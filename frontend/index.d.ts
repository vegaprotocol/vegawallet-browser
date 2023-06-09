import JSONRPCClient from './lib/json-rpc-client'
import JSONRPCServer from './lib/json-rpc-server'
declare global {
  interface Window {
    client: JSONRPCClient
    server: JSONRPCServer
    vega: any
    sendTransactionResult: any
    connectWalletResult: any
  }
}
