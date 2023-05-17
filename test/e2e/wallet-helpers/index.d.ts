import JSONRPCClient from '../../../src/lib/json-rpc-client'
declare global {
  interface Window {
    client: JSONRPCClient
  }
}
