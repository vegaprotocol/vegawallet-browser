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
      REVIEW_TRANSACTION: 'popup.review_transaction'
    }
  }

  static get EVENTS() {
    return {
      TRANSACTION_COUNT_CHANGED: 'transaction-count-changed'
    }
  }

  constructor({ onbeforerequest, onafterrequest } = {}) {
    this.onbeforerequest = onbeforerequest
    this.onafterrequest = onafterrequest

    this.ports = new Set()
    this.persistentQueue = []

    this.client = new JSONRPCClient({
      idPrefix: 'background-',
      send: (msg) => {
        this.persistentQueue.push(msg)
        this._emitter.emit(PopupClient.EVENTS.TRANSACTION_COUNT_CHANGED, {
          transactionsPending: this.totalPending()
        })
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

  totalTransactionsPending() {
    return this.persistentQueue.filter((msg) => msg.method === 'popup.review_transaction').length
  }

  reviewConnection(params) {
    return this._send(PopupClient.METHODS.REVIEW_CONNECTION, params)
  }

  reviewTransaction(params) {
    return this._send(PopupClient.METHODS.REVIEW_TRANSACTION, params)
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
    // Update the transaction count
    this._emitter.emit(PopupClient.EVENTS.TRANSACTION_COUNT_CHANGED, {
      transactionsPending: this.totalPending()
    })

    const self = this
    function _onmessage(message) {
      if (isResponse(message)) {
        self.persistentQueue = self.persistentQueue.filter((msg) => msg.id !== message.id)
        self._emitter.emit(PopupClient.EVENTS.TRANSACTION_COUNT_CHANGED, {
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
