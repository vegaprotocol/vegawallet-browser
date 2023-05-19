import JSONRPCClient from '../lib/json-rpc-client.js'
import assert from 'nanoassert'

export class PopupClient {
  constructor() {
    this.ports = new Set()
    this.persistentQueue = new Map()

    this.client = new JSONRPCClient({
      idPrefix: 'background-',
      send: (msg) => {
        this.persistentQueue.set(msg.id, msg)
        this.ports.forEach((p) => p.postMessage(msg))
      }
    })
  }

  async reviewConnection(params) {
    return this.client.request('popup.review_connection', params)
  }

  async reviewTransaction(params) {
    return this.client.request('popup.review_transaction', params)
  }

  async connect(port) {
    this.ports.add(port)

    port.onMessage.addListener(_onmessage)
    port.onDisconnect.addListener(_ondisconnect)

    const self = this
    function _onmessage(message) {
      self.client.onmessage(message)
    }

    function _ondisconnect(port) {
      port.onMessage.removeListener(_onmessage)
      port.onDisconnect.removeListener(_ondisconnect)

      assert(self.ports.delete(port), 'Removed unknown port. Possible leak')
    }
  }
}
