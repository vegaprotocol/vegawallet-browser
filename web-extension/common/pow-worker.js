import { PoW } from '@vegaprotocol/crypto'

// Independent PoW solver as a web worker to unblock the background thread
// the requests are JSON-RPC to ease the client implementation
globalThis.onmessage = async function (ev) {
  // FIXME: this is a hack to make the tests work because the pow-worker.js file is being incorrectly bundled
  // into the application when it should be requested on demand instead.

  // Question, why is this only happening on connect?
  if (!ev.data || !ev.data.method || ev.data.method !== 'solve') return
  const id = ev.data.id
  const { difficulty, blockHash, tid, startNonce, endNonce } = ev.data.params

  globalThis.postMessage({
    jsonrpc: '2.0',
    id,
    result: await PoW.solve(difficulty, blockHash, tid, startNonce, endNonce)
  })
}
