export default class EncryptedStorage {
  constructor(storage, passphrase) {
    this._storage = storage

    this._passphrase = passphrase

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

  async _save() {
    const ciphertext = JSON.stringify(Array.from(this._cache.entries()))

    await this._storage.set('ciphertext', ciphertext)
  }

  async _load() {
    const ciphertext = await this._storage.get('ciphertext')

    return JSON.parse(ciphertext ?? '[]')
  }

  static async create(storage, passphrase) {
    return new this(storage, passphrase)
  }

  async verifyPassphrase(passphrase) {
    return passphrase === this._passphrase
  }

  async exists() {
    return Array.from(await this._storage.entries())
  }

  async open(passphrase) {
    if (!(await this.verifyPassphrase(passphrase))) {
      throw new Error('Invalid passphrase')
    }

    this._cache = new Map(await this._load())
  }

  async close() {
    this._cache = null
    return
  }
}
