import assert from 'nanoassert'

// TODO: Improve this "fetch" shim to handle TCP and HTTP errors
async function getJson (url) {
  return (await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })).json()
}

async function postJson (url, body) {
  return (await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })).json()
}

export default class NodeRPC {
  /**
   *
   * @param {URL[]} nodeUrls
   */
  constructor (nodeUrls, maxDrift = 2) {
    if (!Array.isArray(nodeUrls)) nodeUrls = [nodeUrls]

    assert(nodeUrls.every(u => u instanceof URL), 'nodeUrls must be WHATWG URLs')

    this.urls = nodeUrls
    this.maxDrift = maxDrift
  }

  /**
   * Find a healthy Vega node. Algorithm:
   * 1. Request `/blockchain/height` from all nodes
   * 2. Remove nodes that:
   *  - Don't reply
   *  - Return a HTTP status code outside 2xx
   *  - Have a difference between their core block height and data node block height larger than `maxDrift`
   * 3. Group nodes into buckets of 3 blocks within each other
   * 4. Pick a random node from the largest bucket
   *
   * @returns URL
   */
  async _findHealthyNode () {
    const nodesHeights = await promiseAllResolved(this.urls.map(async u => {
      const res = await fetch(new URL('/blockchain/height', u), {
        headers: {
          Accept: 'application/json'
        }
      })

      if (res.ok === false) throw new Error('Failed request')

      const { height } = await res.json()

      const coreHeight = BigInt(height)
      // The header is not set for talking to core nodes
      const nodeHeight = BigInt(res.headers.get('x-block-height') ?? coreHeight)

      const drift = coreHeight - nodeHeight
      // eslint-disable-next-line yoda
      if (-this.maxDrift > drift || drift > this.maxDrift) throw new Error('Block drift too high')

      return [u, nodeHeight]
    }))

    const maxHeight = nodesHeights.reduce((m, [_, height]) => bigintMax(m, height), 0n)

    const groups = group(nodesHeights, ([node, height]) => {
      const key = (maxHeight - height) / 3n // Group into buckets of 3 blocks
      return [key, node]
    })

    const largestGroup = findLargest(groups)

    if (largestGroup.length === 0) throw new Error('No healthy node found')

    return pickRandom(largestGroup)

    // Math.max does not work with bigint
    /**
     *
     * @param {bigint} a
     * @param {bigint} b
     * @returns bigint
     */
    function bigintMax (a, b) {
      return a > b ? a : b
    }

    function promiseAllResolved (promises) {
      return Promise.allSettled(promises).then(results => {
        return results
          .filter(({ status }) => status === 'fulfilled')
          .map(({ value }) => value)
      })
    }

    function group (values, fn) {
      const groups = values.reduce((map, val) => {
        const [key, value] = fn(val)

        const list = map.get(key) ?? []
        list.push(value)
        map.set(key, list)

        return map
      }, new Map())

      return Array.from(groups.values())
    }

    function findLargest (arr) {
      return arr.reduce((largest, group) => group.length > largest.length ? group : largest, [])
    }

    function pickRandom (arr) {
      return arr[arr.length * Math.random() | 0]
    }
  }

  async blockchainHeight () {
    return getJson(new URL('/blockchain/height', await this._findHealthyNode()))
  }

  async statistics () {
    return getJson(new URL('/statistics', await this._findHealthyNode()))
  }

  /**
   *
   * @param {{ partyId: string }} param0
   * @returns
   */
  async statisticsSpam ({ partyId }) {
    assert(typeof partyId === 'string')
    return getJson(new URL(`/statistics/spam/${partyId}`, await this._findHealthyNode()))
  }

  async checkRawTransaction (tx) {
    const res = await postJson(new URL('/transaction/raw/check', await this._findHealthyNode()), { tx })

    return res
  }

  async submitRawTransaction (tx, type) {
    assert(typeof tx === 'string')
    assert(typeof type === 'string')

    const res = await postJson(new URL('/transaction/raw', await this._findHealthyNode()), {
      tx, type
    })

    // Error codes from https://github.com/vegaprotocol/vega/blob/develop/core/blockchain/response.go
    switch (res.code) {
      case 0: return res

      /* eslint-disable no-fallthrough */
      // AbciTxnValidationFailure ...
      case 51:

      // AbciTxnDecodingFailure code is returned when CheckTx or DeliverTx fail to decode the Txn.
      case 60:

      // AbciTxnInternalError code is returned when CheckTx or DeliverTx fail to process the Txn.
      case 70:

      // AbciUnknownCommandError code is returned when the app doesn't know how to handle a given command.
      case 80:

      // AbciSpamError code is returned when CheckTx or DeliverTx fail spam protection tests.
      case 89:
        throw new Error(Buffer.from(res.data, 'hex').toString())
      /* eslint-enable no-fallthrough */
    }
  }
}
