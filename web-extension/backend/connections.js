import { TinyEventemitter } from '../lib/tiny-eventemitter.js'

export class ConnectionsCollection {
  constructor({ connectionsStore, publicKeyIndexStore }) {
    this.store = connectionsStore
    this.index = publicKeyIndexStore

    this._emitter = new TinyEventemitter()
  }

  on (event, listener) {
    return this._emitter.on(event, listener)
  }

  off (event, listener) {
    return this._emitter.off(event, listener)
  }

  async set(origin, allowList) {
    const value = {
      origin,
      allowList,
      accessedAt: Date.now()
    }

    const res = await this.store.set(origin, value)

    this._emitter.emit('set', value)

    return res
  }

  async touch(origin) {
    return await this.store.transaction(async store => {
      const conn = await store.get(origin)
      if (conn == null) return

      conn.accessedAt = Date.now()

      await store.set(origin, conn)
      this._emitter.emit('set', conn)
    })
  }

  async has(origin) {
    return await this.store.has(origin)
  }

  async list() {
    return Array.from(await this.store.values()).sort((a, b) => {
      return b.accessedAt - a.accessedAt
    })
  }

  async delete(origin) {
    const res = await this.store.delete(origin)

    this._emitter.emit('delete', { origin })

    return res
  }

  disconnect(origin) {
    this._emit('disconnect', { origin })
  }

  async isAllowed(origin, publicKey) {
    const conn = await this.store.get(origin)
    if (conn?.allowList == null) return false
    const { allowList } = conn

    const explicitKey = allowList.publicKeys.includes(publicKey)
    if (explicitKey) return true

    const pkFromIndex = await this.index.get(publicKey)
    if (pkFromIndex == null) return false

    return allowList.wallets.includes(pkFromIndex.wallet)
  }

  async listAllowedKeys(origin) {
    const conn = await this.store.get(origin)
    if (conn?.allowList == null) return []

    const { allowList } = conn

    const keysFromIndex = await this.index.values()
    const keys = []
    for (const { publicKey, name, wallet } of keysFromIndex) {
      if (allowList.wallets.includes(wallet)) {
        keys.push({ publicKey, name })
      }

      if (allowList.publicKeys.includes(publicKey)) {
        keys.push({ publicKey, name })
      }
    }

    return keys
  }
}
