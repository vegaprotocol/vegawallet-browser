import JSONRPCClient from './lib/json-rpc-client'
declare global {
  interface Window {
    client: JSONRPCClient
  }
}
