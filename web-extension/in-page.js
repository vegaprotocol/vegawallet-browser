import JsonRpcClient from '../lib/json-rpc-client.js'
import { isNotification, isResponse } from '../lib/json-rpc.js'

// Wrap in a closure to protect scope
;(() => {
  const listeners = new Map()

  function on(event, callback) {
    const l = listeners.get(event) ?? new Set()
    l.add(callback)
    listeners.set(event, l)

    return () => {
      l.delete(callback)
    }
  }

  function off(event, callback) {
    const l = listeners.get(event) ?? new Set()
    l.delete(callback)
  }

  const client = new JsonRpcClient({
    idPrefix: 'vega.in-page-',
    send(msg) {
      window.postMessage(msg, '*')
    },
    onnotification: (msg) => {
      const l = listeners.get(msg.method) ?? new Set()
      for (const callback of l) {
        try {
          callback(msg.params)
        } catch (_) {}
      }
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
  globalThis.vega = Object.freeze({
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
    },

    // events
    on,
    off,
    addEventListener: on,
    removeEventListener: off
  })
})()
