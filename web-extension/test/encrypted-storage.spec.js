import EncryptedStorage from '../lib/encrypted-storage.js'
import InmemoryStorage from '../lib/inmemory-storage.js'

describe('encrypted-storage', () => {
  it('Invalid passphrase', async () => {
    const encryptedStorage = new EncryptedStorage(new InmemoryStorage(), { memory: 10, iterations: 1 })

    await encryptedStorage.create('passphrase')
    await encryptedStorage.lock()
    await expect(encryptedStorage.unlock('invalid')).rejects.toThrow('Invalid passphrase or corrupted storage')
  })

  it('Storage is not open', async () => {
    const encryptedStorage = new EncryptedStorage(new InmemoryStorage(), { memory: 10, iterations: 1 })

    await expect(encryptedStorage.get('foo')).rejects.toThrow('Storage is locked')
  })

  it('get() returns undefined for missing keys', async () => {
    const encryptedStorage = new EncryptedStorage(new InmemoryStorage(), { memory: 10, iterations: 1 })

    await encryptedStorage.create('passphrase')

    expect(await encryptedStorage.get('foo')).toBe(undefined)
  })

  it('get() returns the value for existing keys', async () => {
    const encryptedStorage = new EncryptedStorage(new InmemoryStorage(), { memory: 10, iterations: 1 })

    await encryptedStorage.create('passphrase')

    await encryptedStorage.set('foo', 'bar')

    expect(await encryptedStorage.get('foo')).toBe('bar')

    await encryptedStorage.lock()

    await encryptedStorage.unlock('passphrase')

    expect(await encryptedStorage.get('foo')).toBe('bar')
  })

  it('Storage is cleared when closed', async () => {
    const encryptedStorage = new EncryptedStorage(new InmemoryStorage(), { memory: 10, iterations: 1 })

    await encryptedStorage.create('passphrase')

    await encryptedStorage.set('foo', 'bar')

    await encryptedStorage.lock()

    await expect(encryptedStorage.get('foo')).rejects.toThrow('Storage is locked')
  })

  it('Change passphrase', async () => {
    const encryptedStorage = new EncryptedStorage(new InmemoryStorage(), { memory: 10, iterations: 1 })

    await encryptedStorage.create('passphrase')

    await encryptedStorage.set('foo', 'bar')

    await encryptedStorage.changePassphrase('passphrase', 'new-passphrase')

    await encryptedStorage.lock()

    await encryptedStorage.unlock('new-passphrase')

    expect(await encryptedStorage.get('foo')).toBe('bar')
  })

  it('Create storage twice', async () => {
    const encryptedStorage = new EncryptedStorage(new InmemoryStorage(), { memory: 10, iterations: 1 })

    await encryptedStorage.create('passphrase')

    await expect(encryptedStorage.create('passphrase')).rejects.toThrow('Storage already exists')
  })

  it('Create storage twice with overwrite', async () => {
    const encryptedStorage = new EncryptedStorage(new InmemoryStorage(), { memory: 10, iterations: 1 })

    await encryptedStorage.create('passphrase')

    await encryptedStorage.create('passphrase2', true)

    expect(await encryptedStorage.verifyPassphrase('passphrase')).toBe(false)
  })

  it('Lock storage twice', async () => {
    const encryptedStorage = new EncryptedStorage(new InmemoryStorage(), { memory: 10, iterations: 1 })

    await encryptedStorage.create('passphrase')

    await encryptedStorage.lock()

    expect(await encryptedStorage.lock()).toBe(null)
  })
})
