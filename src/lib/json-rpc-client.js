// TODO this is duplicated!

/* istanbul ignore file */
export default class JSONRPCClient {
  static Error = class extends Error {
    constructor(msg, code, data) {
      super(msg)
      this.code = code
      this.data = data
    }

    toJSON() {
      return { message: this.message, code: this.code, data: this.data }
    }
  }

  constructor({ send, onnotification = (_) => {} }) {
    this._send = send
    this._onnotification = onnotification ?? (() => {})
    this.inflight = new Map()
    this.id = 0
  }

  notify(method, params) {
    const msg = {
      jsonrpc: '2.0',
      method,
      params
    }

    this._send(msg)
  }

  async request(method, params) {
    const id = '' + ++this.id
    const msg = {
      jsonrpc: '2.0',
      id,
      method,
      params: params
    }

    return new Promise((resolve, reject) => {
      this.inflight.set(id, [resolve, reject])

      this._send(msg)
    })
  }

  /**
   *
   * @param {any} data
   * @returns
   */
  async onmessage(data) {
    if (data == null) return // invalid response

    const id = data?.id
    if (id == null) return this._onnotification(data) // JSON-RPC notifications are not supported for now

    const p = this.inflight.get(id)
    if (p == null) return // duplicate or unknown response

    this.inflight.delete(id)

    if (data.error) {
      const err = new JSONRPCClient.Error(
        data.error.message,
        data.error.code,
        data.error.data
      )
      p[1](err)
      return
    }

    p[0](data.result)
  }
}
