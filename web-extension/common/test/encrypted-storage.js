import { test } from 'brittle'
import EncryptedStorage from '../lib/encrypted-storage.js'

test('encrypted-storage', async (assert) => {
  const encryptedStorage = await EncryptedStorage.create(new Map(), 'passphrase')

  await assert.exception(async () => {
    await encryptedStorage.open('invalid')
  }, 'Invalid passphrase')

  await assert.exception(async () => {
    await encryptedStorage.get('foo')
  }, 'Storage is not open')

  await encryptedStorage.open('passphrase')

  assert.is(await encryptedStorage.get('foo'), undefined, 'get() returns undefined for missing keys')

  await encryptedStorage.set('foo', 'bar')

  assert.is(await encryptedStorage.get('foo'), 'bar', 'get() returns the value for existing keys')

  await encryptedStorage.close()

  await assert.exception(async () => {
    await encryptedStorage.get('foo')
  }, 'Storage is cleared when closed')
})
