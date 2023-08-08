import JSONRPCClient from '../../lib/json-rpc-client.js'
import assert from 'nanoassert'
import { isRequest } from '../../lib/json-rpc.js'

export class PopupClient {
  constructor({ onbeforerequest, onafterrequest }) {
    this.onbeforerequest = onbeforerequest
    this.onafterrequest = onafterrequest

    this.ports = new Set()
    this.persistentQueue = []

    this.client = new JSONRPCClient({
      idPrefix: 'background-',
      send: (msg) => {
        if (isRequest(msg)) {
          this.persistentQueue.push(msg)
        }
        this.ports.forEach((p) => p.postMessage(msg))
      }
    })
  }

  totalPending() {
    return this.persistentQueue.length
  }

  async reviewConnection(params) {
    const decision = await this._send('popup.review_connection', params)
    // this.client.notify('popup.connection_decision', {
    //   decision
    // })
    return decision
  }

  async reviewTransaction(params) {
    const decision = await this._send('popup.review_transaction', params)
    // this.client.notify('popup.transaction_decision', {
    //   decision
    // })
    return decision
  }

  async _send(method, params) {
    const res = this.client.request(method, params)
    // Wait for the request to be added to the send queue
    this.onbeforerequest?.()
    return res
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
      console.log(message)
      if (message.id != null) {
        const idx = self.persistentQueue.findIndex((msg) => msg.id === message.id)
        if (idx !== -1) {
          self.persistentQueue.splice(idx, 1)
        }
      }

      self.client.onmessage(message)
      self.onafterrequest?.()
    }

    function _ondisconnect(port) {
      port.onMessage.removeListener(_onmessage)
      port.onDisconnect.removeListener(_ondisconnect)

      assert(self.ports.delete(port), 'Removed unknown port. Possible leak')
    }
  }
}
