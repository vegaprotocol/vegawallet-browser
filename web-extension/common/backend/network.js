import assert from 'nanoassert'
import NodeRPC from './node-rpc.js'

export class NetworkCollection {
  constructor(store) {
    this.store = store
  }

  /**
   *
   * @param {string} name
   * @param {{name: string, rest: string[], explorer: string}} config
   * @returns {Promise<Network>}
   */
  async set(name, config) {
    assert(typeof config.name === 'string')
    assert(Array.isArray(config.rest))

    // validate
    await this.store.set(name, config)

    return new Network(config)
  }

  /**
   *
   * @param {string} name
   * @returns {Promise<Network>}
   */
  async get(name) {
    const candidate = await this.store.get(name)

    if (candidate == null) throw new Error('Unknown network')

    return new Network(candidate)
  }

  /**
   *
   * @param {string} name
   * @returns {Promise<boolean>}
   */
  async delete(name) {
    return this.store.delete(name)
  }

  /**
   *
   * @returns {Promise<string[]>}
   */
  async list() {
    return Array.from(await this.store.keys())
  }
}

class Network {
  constructor({ name, rest, explorer }) {
    this.name = name
    this.rest = rest
    this.explorer = explorer
  }

  rpc() {
    return new NodeRPC(this.rest.map((u) => new URL(u)))
  }
}
