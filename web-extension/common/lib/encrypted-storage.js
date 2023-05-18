import { encrypt, decrypt } from '@vegaprotocol/crypto/encryption'
import { base64 as toBase64, fromBase64, string as fromString, toString } from '@vegaprotocol/crypto/buf'

export default class EncryptedStorage {
  constructor(storage, kdfSettings = undefined) {
    this._storage = storage

    this._kdfSettings = kdfSettings

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
          if (this.isLocked) {
            throw new Error('Storage is locked')
          }

          const result = await this._cache[method](...args)

          await this._save()

          return result
        }
      })

      // accessors
      ;['get', 'has', 'entries', 'keys', 'values'].forEach((method) => {
        this[method] = async (...args) => {
          if (this.isLocked) {
            throw new Error('Storage is locked')
          }

          return this._cache[method](...args)
        }
      })
  }

  get isLocked() {
    return this._passphrase == null
  }

  /**
   * Save the current state of the cached in-memory storage to the underlying encrypted storage.
   * @returns {Promise<void>}
   * @private
   */
  async _save() {
    const plaintext = fromString(JSON.stringify(Array.from(this._cache.entries())))
    const { ciphertext, salt, kdfParams } = await encrypt(this._passphrase, plaintext, this._kdfSettings)

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
    if (this.isLocked === false) {
      throw new Error('Storage is locked')
    }

    // TODO: Should we instead store a derived value in memory?
    // TODO: This may not be constant time, but does it matter?
    return fromString(passphrase).every((b, i) => b === this._passphrase[i])
  }

  /**
   * Change the passphrase used to encrypt the storage.
   * @param {string} oldPassphrase - The current passphrase.
   * @param {string} newPassphrase - The new passphrase.
   * @returns {Promise<EncryptedStorage>} - The storage instance.
   */
  async changePassphrase(oldPassphrase, newPassphrase) {
    if (this.isLocked === false) {
      throw new Error('Storage is locked')
    }

    if (!await this.verifyPassphrase(oldPassphrase)) {
      throw new Error('Invalid passphrase')
    }

    this._passphrase = fromString(newPassphrase)
    this._save()

    return this
  }

  /**
   * Check if the encrypted storage exists and is populated.
   * @returns {Promise<boolean>} - Whether the storage exists and is populated.
   */
  async exists() {
    return Array.from(await this._storage.entries()).length > 0
  }

  /**
   * Create a new encrypted storage.
   * @param {string} passphrase - The passphrase to use for encryption.
   * @param {boolean} [overwrite=false] - Whether to overwrite an existing storage.
   * @returns {Promise<EncryptedStorage>} - The storage instance.
   */
  async create(passphrase, overwrite = false) {
    if (overwrite === false && await this.exists()) {
      throw new Error('Storage already exists')
    }

    await this.unlock(passphrase)
    await this._save()

    return this
  }

  /**
   * Open the encrypted storage and decrypt into the in-memory cache.
   * If no storage exists, this creates a new one on the first save.
   * @param {string} passphrase - The passphrase to use for encryption.
   * @returns {Promise<EncryptedStorage>} - The storage instance.
   */
  async unlock(passphrase) {
    this._passphrase = fromString(passphrase)
    this._cache = new Map(await this._load())

    return this
  }

  /**
   * Close the encrypted storage, saving and clearing the in-memory cache and passphrase.
   * @returns {Promise<void>}
   */
  async lock() {
    await this._save()
    this._cache = null
    this._passphrase.fill(0)
    this._passphrase = null
    return
  }
}
