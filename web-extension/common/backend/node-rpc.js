import assert from 'nanoassert'

// TODO: Improve this "fetch" shim to handle TCP and HTTP errors
async function getJson (url) {
  return (await fetch(url, {
    headers: {
      'Accept': 'application/json'
    },
  })).json()
}

async function postJson (url, body) {
  return (await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })).json()
}

export default class NodeRPC {
  /**
   *
   * @param {URL} nodeUrl
   */
  constructor (nodeUrl) {
    assert(nodeUrl instanceof URL, 'nodeUrl must be WHATWG URL')

    this.url = nodeUrl
  }

  async blockchainHeight () {
    return getJson(new URL('/blockchain/height', this.url))
  }

  async statistics () {
    return getJson(new URL('/statistics', this.url))
  }

  /**
   *
   * @param {{ partyId: string }} param0
   * @returns
   */
  async statisticsSpam ({ partyId }) {
    assert(typeof partyId === 'string')
    return getJson(new URL(`/statistics/spam/${partyId}`, this.url))
  }

  async checkRawTransaction (tx) {
    const res = await postJson(new URL('/transaction/raw/check', this.url), { tx })

    return res
  }

  async submitRawTransaction (tx, type) {
    assert(typeof tx === 'string')
    assert(typeof type === 'string')

    const res = await postJson(new URL('/transaction/raw', this.url), {
       tx, type
    })

    if (res.code != 0) {
      throw new Error(res)
    }

    return res
  }
}
