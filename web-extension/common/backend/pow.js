import JSONRPCClient from '../lib/json-rpc-client.js'

/* global Worker */
const runtime = (globalThis.browser?.runtime ?? globalThis.chrome?.runtime)

const worker = new Worker(runtime.getURL('/pow-worker.js'))
const client = new JSONRPCClient({
  send (req) {
    worker.postMessage(req)
  }
})
worker.onmessage = (ev) => {
  client.onmessage(ev.data)
}

export default async function (args) {
  return client.request('solve', args)
}
