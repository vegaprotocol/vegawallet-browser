import { z } from 'zod'
import { Serializable } from './types/json'
import { Engine } from './types/engine'

// Based on https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea
export class Storage<V extends Serializable> {
  private _engine: Engine
  private _schema: z.Schema
  private _prefix: string

  constructor(prefix: string, schema: z.Schema<V>, engine: Engine) {
    this._prefix = prefix
    this._schema = schema
    this._engine = engine
  }

  private async _load(): Promise<Record<string, V>> {
    const result = (await this._engine.get(this._prefix)) ?? {}

    return Object.keys(result).reduce(
      (acc, key) => ({
        ...acc,
        [key]: this._schema.parse(result[key]),
      }),
      {}
    )
  }

  async has(key: string): Promise<boolean> {
    const val = await this._load()
    return key in val
  }

  async get(key: string): Promise<V | undefined> {
    const val = await this._load()

    return val[key]
  }
  async set(key: string, value: Readonly<V>): Promise<this> {
    const val = await this._load()

    val[key] = this._schema.parse(value)
    await this._engine.set({ [this._prefix]: val })

    return this
  }
  async delete(key: string): Promise<boolean> {
    const val = await this._load()
    const hadKey = key in val
    if (hadKey) {
      delete val[key]
      await this._engine.set({ [this._prefix]: val })
    }

    return hadKey
  }
  async clear(): Promise<void> {
    await this._engine.remove(this._prefix)
  }

  async keys(): Promise<Array<string>> {
    return Object.keys(await this._load())
  }
  async values(): Promise<Array<Readonly<V>>> {
    return Object.values(await this._load())
  }
  async entries(): Promise<Iterable<[string, Readonly<V>]>> {
    return Object.entries(await this._load())
  }
}
