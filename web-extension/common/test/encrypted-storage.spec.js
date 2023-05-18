import EncryptedStorage from '../lib/encrypted-storage.js'

describe('encrypted-storage', () => {
  test('Invalid passphrase', async () => {
    const store = new Map()
    const encryptedStorage = new EncryptedStorage(store, { memory: 1, iterations: 1 })

    await encryptedStorage.create('passphrase')
    await encryptedStorage.lock()
    await expect(encryptedStorage.unlock('invalid')).rejects.toThrow('Unsupported state or unable to authenticate data')
  })

  test('Storage is not open', async () => {
    const encryptedStorage = new EncryptedStorage(new Map(), { memory: 1, iterations: 1 })

    await expect(encryptedStorage.get('foo')).rejects.toThrow('Storage is locked')
  })

  test('get() returns undefined for missing keys', async () => {
    const encryptedStorage = new EncryptedStorage(new Map(), { memory: 1, iterations: 1 })

    await encryptedStorage.create('passphrase')

    expect(await encryptedStorage.get('foo')).toBe(undefined)
  })

  test('get() returns the value for existing keys', async () => {
    const encryptedStorage = new EncryptedStorage(new Map(), { memory: 1, iterations: 1 })

    await encryptedStorage.create('passphrase')

    await encryptedStorage.set('foo', 'bar')

    expect(await encryptedStorage.get('foo')).toBe('bar')

    await encryptedStorage.lock()

    await encryptedStorage.unlock('passphrase')

    expect(await encryptedStorage.get('foo')).toBe('bar')
  })

  test('Storage is cleared when closed', async () => {
    const encryptedStorage = new EncryptedStorage(new Map(), { memory: 1, iterations: 1 })

    await encryptedStorage.create('passphrase')

    await encryptedStorage.set('foo', 'bar')

    await encryptedStorage.lock()

    await expect(encryptedStorage.get('foo')).rejects.toThrow('Storage is locked')
  })

  test('Change passphrase', async () => {
    const encryptedStorage = new EncryptedStorage(new Map(), { memory: 1, iterations: 1 })

    await encryptedStorage.create('passphrase')

    await encryptedStorage.set('foo', 'bar')

    await encryptedStorage.changePassphrase('passphrase', 'new-passphrase')

    await encryptedStorage.lock()

    await encryptedStorage.unlock('new-passphrase')

    expect(await encryptedStorage.get('foo')).toBe('bar')
  })

  test('Create storage twice', async () => {
    const encryptedStorage = new EncryptedStorage(new Map(), { memory: 1, iterations: 1 })

    await encryptedStorage.create('passphrase')

    await expect(encryptedStorage.create('passphrase')).rejects.toThrow('Storage already exists')
  })

  test('Create storage twice with overwrite', async () => {
    const encryptedStorage = new EncryptedStorage(new Map(), { memory: 1, iterations: 1 })

    await encryptedStorage.create('passphrase')

    await encryptedStorage.create('passphrase', true)
  })
})
