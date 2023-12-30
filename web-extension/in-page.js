import JsonRpcClient from '../lib/json-rpc-client.js'
import { isNotification, isResponse } from '../lib/json-rpc.js'
import { TinyEventemitter } from '../lib/tiny-eventemitter.js'

// Wrap in a closure to protect scope
; (() => {
  const events = new TinyEventemitter()

  const client = new JsonRpcClient({
    idPrefix: 'vega.in-page-',
    send (msg) {
      window.postMessage(msg, '*')
    },
    onnotification: (msg) => {
      events.emit(msg.method, msg.params)
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
    async connectWallet (params) {
      if (params.chainId == null) {
        console.warn('Deprecated: client.connect_wallet should be called with a chainId')
      }
      return client.request('client.connect_wallet', params)
    },
    async disconnectWallet () {
      return client.request('client.disconnect_wallet', null)
    },
    async isConnected () {
      return client.request('client.is_connected', null)
    },
    async listKeys () {
      return client.request('client.list_keys', null)
    },
    async signTransaction (params) {
      return client.request('client.sign_transaction', params)
    },
    async sendTransaction (params) {
      return client.request('client.send_transaction', params)
    },
    async getChainId () {
      console.warn('Deprecated: select the preferred chainId using client.connect_wallet instead')
      return client.request('client.get_chain_id', null)
    },

    // Event API wrapped to protect prototype
    on (name, cb) {
      return events.on(name, cb)
    },
    off (name, cb) {
      return events.off(name, cb)
    },
    addEventListener (name, cb) {
      return events.on(name, cb)
    },
    removeEventListener (name, cb) {
      return events.off(name, cb)
    }
  })
})()
