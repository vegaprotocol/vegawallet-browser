import type * as JSON from './types/json'

export default class LSMap<V extends JSON.Serializable> extends Map<string, V> {
  private _prefix: string
  constructor(prefix: string) {
    super(load(prefix))
    this._prefix = prefix
  }

  set(key: string, value: V) {
    super.set(key, value)
    save(this._prefix, Array.from(this.entries()))
    return this
  }

  clear() {
    super.clear()
    remove(this._prefix)
  }
}

function load(key: string) {
  const val = global.localStorage.getItem(key)
  if (val == null) return undefined

  return JSON.parse(val)
}

function save(key: string, value: [string, JSON.Serializable][]) {
  global.localStorage.setItem(key, JSON.stringify(value))
}

function remove(key: string) {
  global.localStorage.removeItem(key)
}
