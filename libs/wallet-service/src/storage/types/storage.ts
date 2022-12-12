import type { Serializable } from './json'

/**
 * Interface for Map-like storage backends used by the various
 * wallet subservices to persist state. Note that consumers of
 * any `Storage` should always await the member methods, however
 * we also allow sync implementations (eg. `Map` itself)
 */
export interface Storage<V extends Serializable> {
  // Sync or Async, but always await
  has(key: string): boolean | Promise<boolean>
  get(key: string): V | undefined | Promise<V | undefined>
  set(key: string, value: Readonly<V>): this | Promise<this>
  delete(key: string): boolean | Promise<boolean>
  clear(): void | Promise<void>

  keys(): Iterable<string> | Promise<Iterable<string>>
  values(): Iterable<Readonly<V>> | Promise<Iterable<Readonly<V>>>
  entries():
    | Iterable<[string, Readonly<V>]>
    | Promise<Iterable<[string, Readonly<V>]>>
}
