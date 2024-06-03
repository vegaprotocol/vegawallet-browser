import JSONRPCClient from '../../lib/json-rpc-client.js'
import assert from 'nanoassert'
import { isResponse } from '../../lib/json-rpc.js'
import { TinyEventemitter } from '../lib/tiny-eventemitter.js'

/**
 * Popup client
 * @constructor
 * @param {object} opts Options note that onbeforerequest and onafterrequest will not be called if the method is "ping"
 */
export class PopupClient {
  static get METHODS() {
    return {
      REVIEW_CONNECTION: 'popup.review_connection',
      REVIEW_TRANSACTION: 'popup.review_transaction',
      TRANSACTION_RECEIVED: 'popup.transaction_received'
    }
  }

  constructor({ onbeforerequest, onafterrequest }) {
    this.onbeforerequest = onbeforerequest
    this.onafterrequest = onafterrequest

    this.ports = new Set()
    this.persistentQueue = []

    this.client = new JSONRPCClient({
      idPrefix: 'background-',
      send: (msg) => {
        this.persistentQueue.push(msg)
        this.ports.forEach((p) => p.postMessage(msg))
      }
    })
    this._emitter = new TinyEventemitter()
  }

  on(event, listener) {
    return this._emitter.on(event, listener)
  }

  off(event, listener) {
    return this._emitter.off(event, listener)
  }

  totalPending() {
    return this.persistentQueue.length
  }

  reviewConnection(params) {
    return this._send(PopupClient.METHODS.REVIEW_CONNECTION, params)
  }

  async reviewTransaction(params) {
    const res = await this._send(PopupClient.METHODS.REVIEW_TRANSACTION, params)
    this._emitter.emit(PopupClient.METHODS.TRANSACTION_RECEIVED, {
      transactionsPending: this.totalPending()
    })
    return res
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
      if (isResponse(message)) {
        const idx = self.persistentQueue.findIndex((msg) => msg.id === message.id)
        if (idx !== -1) {
          self.persistentQueue.splice(idx, 1)
        }
        this._emitter.emit(PopupClient.METHODS.TRANSACTION_RECEIVED, {
          transactionsPending: self.totalPending()
        })
      }

      self.client.onmessage(message)

      if (isResponse(message)) {
        self.onafterrequest?.()
      }
    }

    function _ondisconnect(port) {
      port.onMessage.removeListener(_onmessage)
      port.onDisconnect.removeListener(_ondisconnect)

      assert(self.ports.delete(port), 'Removed unknown port. Possible leak')
    }
  }
}
