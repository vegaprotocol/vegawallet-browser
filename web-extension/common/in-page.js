import JsonRpcClient from './lib/json-rpc-client'
// Wrap in a closure to protect scope
(() => {
  const client = new JsonRpcClient({
    send (msg) {
      window.postMessage(msg, '*')
    }
  })

  window.addEventListener('message', (event) => {
    if (event.origin !== "null") return
    if (event.source !== window) return

    const data = event.data

    const isNotification = data.jsonrpc === '2.0' && 'method' in data && data.id == null
    const isResponse = data.jsonrpc === '2.0' && data.id != null && ('result' in data || 'error' in data)

    // Only react to repsponses and notifications
    if (!isNotification && !isResponse) return

    client.onmessage(data)
  }, false)

  // Define end-use API
  globalThis.vega = {
    async connectWallet (params) {
      return client.request('client.connect_wallet', params)
    },
    async disconnectWallet (params) {
      return client.request('client.disconnect_wallet', params)
    },
    async listKeys (params) {
      return client.request('client.list_keys', params)
    },
    async signTransaction (params) {
      return client.request('client.sign_transaction', params)
    },
    async sendTransaction (params) {
      return client.request('client.send_transaction', params)
    },
    async getChainId (params) {
      return client.request('client.get_chain_id', params)
    }
  }
})()
