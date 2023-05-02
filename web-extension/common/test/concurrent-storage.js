import { test } from 'brittle'
import ConcurrentStorage from '../lib/concurrent-storage.js'

test('concurrent storage', async (assert) => {
  const storage = new Map()
  const concurrentStorage = new ConcurrentStorage(storage)

  await concurrentStorage.transaction(async (store) => {
    assert.ok((await store.get('foo')) == null, 'get() returns undefined for missing keys')

    await assert.exception(async () => {
      await concurrentStorage.get('foo')
    }, 'Deadlok detected on nested access')

    await store.set('foo', 'bar')

    assert.is(await store.get('foo'), 'bar', 'get() returns the value for existing keys')
  })

  assert.is(await concurrentStorage.get('foo'), 'bar', 'get() returns the value for existing keys')
})

test('nested concurrent storage', async (assert) => {
  const storage = new Map()
  const c1 = new ConcurrentStorage(storage)
  const c2 = new ConcurrentStorage(c1)

  await c2.transaction(async (store) => {
    assert.ok((await store.get('foo')) == null, 'get() returns undefined for missing keys')

    await assert.exception(async () => {
      await c2.get('foo')
    }, 'Deadlok detected on nested access')

    await store.set('foo', 'bar')
  })

  assert.is(await c2.get('foo'), await c1.get('foo'), 'get() returns the value for existing keys on nested storage')
})
