import { PoW } from '@vegaprotocol/crypto'

// Independent PoW solver as a web worker to unblock the background thread
// the requests are JSON-RPC to ease the client implementation
globalThis.onmessage = async function (ev) {
  const id = ev.data.id
  const { difficulty, blockHash, tid } = ev.data.params

  globalThis.postMessage({
    jsonrpc: '2.0',
    id,
    result: await PoW.solve(
      difficulty,
      blockHash,
      tid
    )
  })
}
