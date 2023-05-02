import mutexify from 'mutexify'

function mutexifyPromise() {
  const lock = mutexify()

  const acquire = function(failFast = false) {
    if (failFast === true && acquire.locked === true) throw new Error('Deadlock detected')
    return new Promise(lock)
  }

  Object.defineProperty(acquire, 'locked', {
    get: function() { return lock.locked },
    enumerable: true
  })

  return acquire
}


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
    this._lock = mutexifyPromise()
    this._transaction = false

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    this.has = wrapMutexify(this._storage.has)

    /**
     * @param {string} key
     * @returns {Promise<any>}
     */
    this.get = wrapMutexify(this._storage.get)

    /**
     * @param {string} key
     * @param {any} value
     * @returns {Promise<this>}
     */
    this.set = wrapMutexify(this._storage.set)

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    this.delete = wrapMutexify(this._storage.delete)

    /**
     * @returns {Promise<void>}
     */
    this.clear = wrapMutexify(this._storage.clear)

    /**
     * @returns {Promise<IterableIterator<string>}
     */
    this.keys = wrapMutexify(this._storage.keys)

    /**
     * @returns {Promise<IterableIterator<any>}
     */
    this.values = wrapMutexify(this._storage.values)

    /**
     * @returns {Promise<IterableIterator<[string, any]>}
     */
    this.entries = wrapMutexify(this._storage.entries)

    function wrapMutexify(fn) {
      return async (...args) => {
        const release = await this._lock(this._transaction)
        try {
          return await fn(...args)
        } finally {
          release()
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
    const release = await this._lock(true)
    this._transaction = true
    try {
      return await fn(this._storage)
    } finally {
      release()
      this._transaction = false
    }
  }
}

