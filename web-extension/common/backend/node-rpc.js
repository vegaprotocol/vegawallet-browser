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
  constructor (nodeUrls) {
    if (typeof nodeUrls === 'string') nodeUrls = [nodeUrls]

    assert(nodeUrls.every(u => u instanceof URL), 'nodeUrls must be WHATWG URLs')

    this.urls = nodeUrls
  }

  async _findHealthyNode () {
    return this.urls.at(0)
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
