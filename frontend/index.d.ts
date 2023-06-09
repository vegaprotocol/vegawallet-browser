import JSONRPCClient from '../json-rpc/json-rpc-client'
import JSONRPCServer from '../json-rpc/json-rpc-server'
declare global {
  interface Window {
    client: JSONRPCClient
    server: JSONRPCServer
    vega: any
    sendTransactionResult: any
    connectWalletResult: any
  }
}
