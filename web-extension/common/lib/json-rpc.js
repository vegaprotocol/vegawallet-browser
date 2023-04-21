export function isNotification(message) {
  return (
    message?.jsonrpc === '2.0' && 'method' in message && message?.id == null
  )
}

export function isRequest(message) {
  return (
    message?.jsonrpc === '2.0' &&
    typeof message?.method === 'string' &&
    message?.id != null
  )
}

export function isResponse(message) {
  return (
    message?.jsonrpc === '2.0' &&
    message?.id != null &&
    ('result' in message || 'error' in message)
  )
}

export class JSONRPCError extends Error {
  constructor(message, code, data) {
    super(message)
    this.code = code
    this.data = data
  }

  toJSON() {
    return { message: this.message, code: this.code, data: this.data }
  }
}
