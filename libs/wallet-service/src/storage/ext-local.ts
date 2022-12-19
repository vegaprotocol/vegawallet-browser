import { Serializable } from './types/json'

const storage = (browser ?? chrome)?.storage?.local

// Based on https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea
export default class ExtLocalMap<V extends Serializable> {
  static isSupported(): boolean {
    return storage != null
  }

  private _prefix: string

  constructor(prefix: string) {
    this._prefix = prefix

    if (!ExtLocalMap.isSupported())
      throw new Error('Unsupported storage runtime')
  }

  private async _load(): Promise<Record<string, V>> {
    return (await storage.get(this._prefix))?.[this._prefix] ?? {}
  }

  async has(key: string): Promise<boolean> {
    return (await this._load())[key] !== undefined
  }

  async get(key: string): Promise<V | undefined> {
    const val = await this._load()

    return val[key]
  }
  async set(key: string, value: Readonly<V>): Promise<this> {
    const val = await this._load()

    val[key] = value
    await storage.set({
      [this._prefix]: val,
    })

    return this
  }
  async delete(key: string): Promise<boolean> {
    const val = await this._load()
    const hadKey = val[key] != null
    if (hadKey) {
      delete val[key]
      await storage.set({
        [this._prefix]: val,
      })
    }

    return hadKey
  }
  async clear(): Promise<void> {
    await storage.remove(this._prefix)
  }

  async keys(): Promise<Iterable<string>> {
    return Object.keys(await this._load())
  }
  async values(): Promise<Iterable<Readonly<V>>> {
    return Object.values(await this._load())
  }
  async entries(): Promise<Iterable<[string, Readonly<V>]>> {
    return Object.entries(await this._load())
  }
}
