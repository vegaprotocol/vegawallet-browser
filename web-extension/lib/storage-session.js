const storage = (globalThis?.browser ?? globalThis?.chrome)?.storage?.session

// Based on https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea
export default class StorageSessionMap {
  static isSupported () {
    return storage != null
  }

  // Scary name
  static async permanentClearAll () {
    return storage.clear()
  }

  constructor (prefix) {
    this._prefix = prefix
    if (!StorageSessionMap.isSupported()) {
      throw new Error('Unsupported storage runtime')
    }
  }

  async _load () {
    return (await storage.get(this._prefix))?.[this._prefix] ?? {}
  }

  async has (key) {
    return (await this._load())[key] !== undefined
  }

  async get (key) {
    const val = await this._load()
    return val[key]
  }

  async set (key, value) {
    const val = await this._load()
    val[key] = value
    await storage.set({
      [this._prefix]: val
    })
    return this
  }

  async delete (key) {
    const val = await this._load()
    const hadKey = val[key] != null
    if (hadKey) {
      delete val[key]
      await storage.set({
        [this._prefix]: val
      })
    }
    return hadKey
  }

  async clear () {
    await storage.remove(this._prefix)
  }

  async keys () {
    return Object.keys(await this._load())
  }

  async values () {
    return Object.values(await this._load())
  }

  async entries () {
    return Object.entries(await this._load())
  }
}