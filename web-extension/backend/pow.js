/* global Worker */
import JSONRPCClient from '../../lib/json-rpc-client.js'
import mutex from 'mutexify/promise.js'
import { PoW } from '@vegaprotocol/crypto'

const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime

const U64_MAX = 2n ** 64n - 1n

// Use all but two cores for solving
// FIXME: Chrome does not support Workers in ServiceWorkers (ie the background page)
// so as a workaround we set concurrency to 0 and handle this in the solver
const NUM_WORKERS = globalThis.Worker == null ? 0 : Math.max(navigator.hardwareConcurrency - 2, 1)

// Increase to make buckets twice as big, which will make
// the amount of wasted work grow by a factor of NUM_WORKERS - 1, but
// also make the overhead smaller (messages, context switch out of WASM when solving)
const BUCKET_SIZE = 14n

const PARTITION_DIV = U64_MAX >> BUCKET_SIZE

const workers = Array.from({ length: NUM_WORKERS }, (_) => {
  const worker = new Worker(runtime.getURL('pow-worker.js'))

  const client = new JSONRPCClient({
    send(req) {
      worker.postMessage(req)
    }
  })
  worker.onmessage = (ev) => {
    client.onmessage(ev.data)
  }

  return client
})

// We create a lock queue so that we are not over-saturating with interleaved work
const lock = mutex()
export default async function (args) {
  // FIXME: Workaround for chrome which doens't support workers. See the note above for
  // NUM_WORKERS
  if (NUM_WORKERS === 0) return PoW.solve(args.difficulty, args.blockHash, args.tid)

  const release = await lock()

  try {
    for (let i = 0; i < PARTITION_DIV; i += NUM_WORKERS) {
      const res = await Promise.all(
        workers.map((w, j) => {
          const startNonce = (BigInt(i + j) * U64_MAX) / BigInt(PARTITION_DIV)
          const endNonce = (BigInt(i + j + 1) * U64_MAX) / BigInt(PARTITION_DIV)

          return w.request('solve', { ...args, startNonce, endNonce })
        })
      )

      const nonce = res.find((r) => r.nonce != null)

      if (nonce != null) return nonce
    }
  } finally {
    release()
  }
}
