import { test } from 'brittle'
import LockedStorage from '../lib/concurrent-storage.js'

test('locked-storage', async (assert) => {
  const storage = new Map()
  const lockedStorage = new LockedStorage(storage)

  await lockedStorage.transaction(async (store) => {
    assert.ok((await store.get('foo')) == null)

    assert.exception(async () => {
      await lockedStorage.get('foo')
    })
  })
})
