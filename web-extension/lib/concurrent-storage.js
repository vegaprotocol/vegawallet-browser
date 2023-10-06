import RW from 'read-write-mutexify'

/**
 * Storage proxy that wraps all methods in a mutex to prevent concurrent access
 * to the underlying storage. It also provides a transaction method to run
 * multiple operations in a single mutex lock.
 *
 * @param {StorageLocalMap} storage
 * @returns {StorageLocalMap}
 */
export default class ConcurrentStorage {
  constructor(storage) {
    this._storage = storage
    this._rw = new RW()

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    this.has = wrapRead(this._storage.has.bind(this._storage))

    /**
     * @param {string} key
     * @returns {Promise<any>}
     */
    this.get = wrapRead(this._storage.get.bind(this._storage))

    this.getMany = wrapRead(this._storage.getMany.bind(this._storage))

    /**
     * @param {string} key
     * @param {any} value
     * @returns {Promise<this>}
     */
    this.set = wrapWrite(this._storage.set.bind(this._storage))

    this.setMany = wrapWrite(this._storage.setMany.bind(this._storage))

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    this.delete = wrapWrite(this._storage.delete.bind(this._storage))

    /**
     * @returns {Promise<void>}
     */
    this.clear = wrapWrite(this._storage.clear.bind(this._storage))

    /**
     * @returns {Promise<IterableIterator<string>}
     */
    this.keys = wrapRead(this._storage.keys.bind(this._storage))

    /**
     * @returns {Promise<IterableIterator<any>}
     */
    this.values = wrapRead(this._storage.values.bind(this._storage))

    /**
     * @returns {Promise<IterableIterator<[string, any]>}
     */
    this.entries = wrapRead(this._storage.entries.bind(this._storage))

    const self = this
    function wrapRead(fn) {
      return async (...args) => {
        await self._rw.read.lock()
        try {
          return await fn(...args)
        } finally {
          self._rw.read.unlock()
        }
      }
    }

    function wrapWrite(fn) {
      return async (...args) => {
        await self._rw.write.lock()
        try {
          return await fn(...args)
        } finally {
          self._rw.write.unlock()
        }
      }
    }
  }

  /**
   * @param {function(StorageLocalMap): Promise<any>} fn
   * @returns {Promise<any>}
   * @throws {Error} if fn throws
   * @throws {Error} if lock is already acquired
   */
  async transaction(fn) {
    await this._rw.write.lock()
    try {
      return await fn(this._storage)
    } finally {
      this._rw.write.unlock()
    }
  }
}
