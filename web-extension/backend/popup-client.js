import JSONRPCClient from '../../lib/json-rpc-client.js'
import assert from 'nanoassert'

export class PopupClient {
  constructor() {
    this.ports = new Set()
    this.persistentQueue = []

    this.client = new JSONRPCClient({
      idPrefix: 'background-',
      send: (msg) => {
        this.persistentQueue.push(msg)
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

    // Send all pending messages
    for (const msg of this.persistentQueue) {
      port.postMessage(msg)
    }

    const self = this
    function _onmessage(message) {
      if (message.id != null) {
        const idx = self.persistentQueue.findIndex((msg) => msg.id === message.id)
        if (idx !== -1) {
          self.persistentQueue.splice(idx, 1)
        }
      }

      self.client.onmessage(message)
    }

    function _ondisconnect(port) {
      port.onMessage.removeListener(_onmessage)
      port.onDisconnect.removeListener(_ondisconnect)

      assert(self.ports.delete(port), 'Removed unknown port. Possible leak')
    }
  }
}
