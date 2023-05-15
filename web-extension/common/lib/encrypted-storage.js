import { encrypt, decrypt } from '@vegaprotocol/crypto/encryption'
import { base64 as toBase64, fromBase64, string as fromString, toString } from '@vegaprotocol/crypto/buf'

export default class EncryptedStorage {
  constructor(storage) {
    this._storage = storage

    /**
     * The passphrase used to encrypt the storage.
     * This is stored in memory and cleared when the storage is closed.
     * @type {Uint8Array}
     * @private
     */
    this._passphrase = null

    /**
     * An in-memory cache of the decrypted storage.
     * @type {Map}
     * @private
     */
    this._cache = null

      // mutators
      ;['set', 'delete', 'clear'].forEach((method) => {
        this[method] = async (...args) => {
          if (this._cache == null) {
            throw new Error('Storage is not open')
          }

          const result = await this._cache[method](...args)

          await this._save()

          return result
        }
      })

      // accessors
      ;['get', 'has', 'entries', 'keys', 'values'].forEach((method) => {
        this[method] = async (...args) => {
          if (this._cache == null) {
            throw new Error('Storage is not open')
          }

          return this._cache[method](...args)
        }
      })
  }

  /**
   * Create a new encrypted storage instance.
   * This is the main initializer for this class.
   * Do not use the constructor directly.
   *
   * Note that you must call `open()` before using the storage.
   *
   * @param {StorageLocalMap} storage - The underlying storage to use.
   * @param {string} passphrase - The passphrase to use for encryption.
   * @returns {Promise<EncryptedStorage>} - The encrypted storage instance.
   */
  static async create(storage, passphrase) {
    const inst = new this(storage)
    return inst
  }

  /**
   * Save the current state of the cached in-memory storage to the underlying encrypted storage.
   * @returns {Promise<void>}
   * @private
   */
  async _save() {
    const plaintext = fromString(JSON.stringify(Array.from(this._cache.entries())))
    const { ciphertext, salt, kdfParams } = await encrypt(this._passphrase, plaintext)

    await Promise.all([this._storage.set('ciphertext', toBase64(ciphertext)),
    this._storage.set('salt', toBase64(salt)),
    this._storage.set('kdfParams', kdfParams)
    ])
  }

  /**
   * Load the encrypted storage and decrypt into the cached in-memory storage.
   * @returns {Promise<Array>}
   * @private
   */
  async _load() {
    const [ciphertext, salt, kdfParams] = await Promise.all([
      this._storage.get('ciphertext'),
      this._storage.get('salt'),
      this._storage.get('kdfParams')
    ])

    if (ciphertext == null || salt == null || kdfParams == null) {
      return []
    }

    const plaintext = await decrypt(this._passphrase, fromBase64(ciphertext), fromBase64(salt), kdfParams)

    return JSON.parse(toString(plaintext))
  }

  /**
   * Verify that the given passphrase is equal to the one used to encrypt the storage.
   * @param {string} passphrase - The passphrase to verify.
   * @returns {Promise<boolean>} - Whether the passphrase is valid.
   */
  async verifyPassphrase(passphrase) {
    // TODO: Should we instead store a derived value in memory?
    return fromString(passphrase) === this._passphrase
  }

  /**
   * Check if the encrypted storage exists and is populated.
   * @returns {Promise<boolean>} - Whether the storage exists and is populated.
   */
  async exists() {
    return Array.from(await this._storage.entries())
  }

  /**
   * Open the encrypted storage and decrypt into the in-memory cache.
   * @param {string} passphrase - The passphrase to use for encryption.
   * @returns {Promise<void>}
   */
  async open(passphrase) {
    this._passphrase = fromString(passphrase)
    this._cache = new Map(await this._load())
  }

  /**
   * Close the encrypted storage, clearing the in-memory cache and passphrase.
   * @returns {Promise<void>}
   */
  async close() {
    this._cache = null
    this._passphrase.fill(0)
    this._passphrase = null
    return
  }
}
