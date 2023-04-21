import assert from 'nanoassert'

export class PortServer {
  constructor ({
    onerror = (_) => { },
    onbeforerequest = () => { },
    onafterrequest = () => { },
    server
  }) {
    this.onerror = onerror
    this.onbeforerequest = onbeforerequest
    this.onafterrequest = onafterrequest
    this.server = server

    // Map<Port, []>
    this.ports = new Map()
  }

  totalPending () {
    return Array.from(this.ports.values(), v => v.length)
      .reduce((sum, size) => sum + size, 0)
  }

  listen (port) {
    const self = this

    const origin = new URL(port.sender.url).origin
    const messageQueue = []
    let busy = false

    const context = { port, origin }

    this.ports.set(port, messageQueue)

    port.onMessage.addListener(_onmessage)
    port.onDisconnect.addListener(_ondisconnect)

    function _onmessage (message) {
      // Append a message to the queue and
      // kick off the processing loop if idle
      messageQueue.push(message)

      if (busy === false) _process()
    }

    function _process () {
      self.onbeforerequest()
      const req = messageQueue.shift()
      if (req == null) return
      busy = true

      self.server.onrequest(req, context)
        .then(res => {
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

    function _ondisconnect (port) {
      port.onMessage.removeListener(_onmessage)
      port.onDisconnect.removeListener(_ondisconnect)

      assert(self.ports.delete(port), 'Removed unknown port. Possible leak')
    }
  }
}
