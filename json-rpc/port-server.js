import assert from 'nanoassert'

export class PortServer {
  /**
   * PortServer handles JSONRPCServer requests from a MessagePort as a FIFO queue.
   * Multiple ports can be listened to at once, each getting their own queue.
   * Each queue is processed sequentially, only allowing a single in-flight message at a time.
   * Request handlers are passed the validated JSON RPC message and a context object containing the port and origin.
   * Additional metadata can be assigned to the context object. The context object is unique to each port and persistent.
   *
   * @constructor
   * @param {object} opts
   * @param {function} opts.onerror - global error handler
   * @param {function} opts.onbeforerequest - called before attempting to process a request (even if the queue is empty)
   * @param {function} opts.onafterrequest - called after processing a request (both success and failure)
   * @param {JSONRPCServer} opts.server - JSONRPCServer instance
   */
  constructor({ onerror = (_) => {}, onbeforerequest = () => {}, onafterrequest = () => {}, server }) {
    this.onerror = onerror
    this.onbeforerequest = onbeforerequest
    this.onafterrequest = onafterrequest
    this.server = server

    // Map<Port, []>
    this.ports = new Map()
  }

  /**
   * Calculate the total number of pending requests across all listening ports
   * @returns {number}
   */
  totalPending() {
    return Array.from(this.ports.values(), (v) => v.length).reduce((sum, size) => sum + size, 0)
  }

  /**
   * Listen to a MessagePort
   * @param {Port} port
   * @returns {void}
   */
  listen(port) {
    const self = this

    const origin = port.sender && new URL(port.sender.url).origin
    const messageQueue = []
    let busy = false

    const context = { port, origin }

    this.ports.set(port, messageQueue)

    port.onMessage.addListener(_onmessage)
    port.onDisconnect.addListener(_ondisconnect)

    function _onmessage(message) {
      // Append a message to the queue and
      // kick off the processing loop if idle
      messageQueue.push(message)

      if (busy === false) _process()
    }

    function _process() {
      self.onbeforerequest()
      const req = messageQueue.shift()
      if (req == null) return
      busy = true

      self.server
        .onrequest(req, context)
        .then((res) => {
          // notification
          if (res == null) return

          // Client disconnected
          if (self.ports.has(port) === false) return

          port.postMessage(res)
        })
        .catch(self.onerror)
        .finally(() => {
          self.onafterrequest()
          busy = false
          _process()
        })
    }

    function _ondisconnect(port) {
      port.onMessage.removeListener(_onmessage)
      port.onDisconnect.removeListener(_ondisconnect)

      assert(self.ports.delete(port), 'Removed unknown port. Possible leak')
    }
  }
}
