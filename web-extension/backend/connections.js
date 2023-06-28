export class ConnectionsCollection {
  constructor({ connectionsStore, publicKeyIndexStore }) {
    this.store = connectionsStore
    this.index = publicKeyIndexStore

    this.listeners = new Set()
  }

  listen(listener) {
    this.listeners.add(listener)

    return () => this.listeners.delete(listener)
  }

  _emit(event, ...args) {
    for (const listener of this.listeners) {
      try {
        listener(event, ...args)
      } catch (_) {}
    }
  }

  async set(origin, allowList) {
    const res = await this.store.set(origin, {
      origin,
      allowList
    })

    this._emit('set', { origin, allowList })

    return res
  }

  async has(origin) {
    return await this.store.has(origin)
  }

  async list() {
    return Array.from(await this.store.values())
  }

  async delete(origin) {
    const res = await this.store.delete(origin)

    this._emit('delete', { origin })

    return res
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
