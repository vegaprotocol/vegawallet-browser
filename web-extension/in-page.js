import JsonRpcClient from '../lib/json-rpc-client.js'
import { isNotification, isResponse } from '../lib/json-rpc.js'

// Wrap in a closure to protect scope
;(() => {
  const client = new JsonRpcClient({
    idPrefix: 'vega.in-page-',
    send(msg) {
      window.postMessage(msg, '*')
    }
  })

  window.addEventListener(
    'message',
    (event) => {
      if (event.source !== window) return

      const data = event.data

      // Only react to repsponses and notifications
      if (!isNotification(data) && !isResponse(data)) return

      client.onmessage(data)
    },
    false
  )

  // Define end-use API
  globalThis.vega = {
    async connectWallet() {
      return client.request('client.connect_wallet', null)
    },
    async disconnectWallet() {
      return client.request('client.disconnect_wallet', null)
    },
    async listKeys() {
      return client.request('client.list_keys', null)
    },
    async signTransaction(params) {
      return client.request('client.sign_transaction', params)
    },
    async sendTransaction(params) {
      return client.request('client.send_transaction', params)
    },
    async getChainId() {
      return client.request('client.get_chain_id', null)
    }
  }
})()
