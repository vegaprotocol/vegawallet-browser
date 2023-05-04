import EncryptedStorage from '../lib/encrypted-storage.js'

describe('encrypted-storage', () => {
  test('Invalid passphrase', async () => {
    const encryptedStorage = await EncryptedStorage.create(new Map(), 'passphrase')

    await expect(encryptedStorage.open('invalid')).rejects.toThrow('Invalid passphrase')
  })

  test('Storage is not open', async () => {
    const encryptedStorage = await EncryptedStorage.create(new Map(), 'passphrase')

    await expect(encryptedStorage.get('foo')).rejects.toThrow('Storage is not open')
  })

  test('get() returns undefined for missing keys', async () => {
    const encryptedStorage = await EncryptedStorage.create(new Map(), 'passphrase')

    await encryptedStorage.open('passphrase')

    expect(await encryptedStorage.get('foo')).toBe(undefined)
  })

  test('get() returns the value for existing keys', async () => {
    const encryptedStorage = await EncryptedStorage.create(new Map(), 'passphrase')

    await encryptedStorage.open('passphrase')

    await encryptedStorage.set('foo', 'bar')

    expect(await encryptedStorage.get('foo')).toBe('bar')
  })

  test('Storage is cleared when closed', async () => {
    const encryptedStorage = await EncryptedStorage.create(new Map(), 'passphrase')

    await encryptedStorage.open('passphrase')

    await encryptedStorage.set('foo', 'bar')

    await encryptedStorage.close()

    await expect(encryptedStorage.get('foo')).rejects.toThrow('Storage is not open')
  })
})
