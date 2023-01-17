import test from 'tape'
import { z } from 'zod'
import { Storage } from './wrapper'

class StorageEngineMock {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private s: Map<string, any>

  constructor() {
    this.s = new Map()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(keys?: string | string[] | { [key: string]: any }) {
    if (Array.isArray(keys)) {
      const result = (keys as string[]).reduce(
        (acc, k) => ({
          ...acc,
          [k]: this.s.get(k),
        }),
        {}
      )
      return Promise.resolve(result)
    } else if (typeof keys === 'string') {
      return Promise.resolve(this.s.get(keys))
    } else if (typeof keys === 'object') {
      const result = Object.keys(keys).reduce(
        (acc, k) => ({
          ...acc,
          [k]: this.s.get(k) || keys[k],
        }),
        {}
      )
      return Promise.resolve(result)
    }
    return Promise.resolve(undefined)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(items: { [key: string]: any }) {
    Object.keys(items).forEach((k) => this.s.set(k, items[k]))
    return Promise.resolve(undefined)
  }

  remove(keys: string | string[]) {
    if (Array.isArray(keys)) {
      keys.forEach((k) => this.s.delete(k))
    } else {
      this.s.delete(keys)
    }

    return Promise.resolve(undefined)
  }

  clear() {
    this.s.clear()
    return Promise.resolve(undefined)
  }
}

const StringSchema = z.string()

test('has', async (assert) => {
  const m = new Storage<string>('test', StringSchema, new StorageEngineMock())
  assert.equal(await m.has('key'), false)
  await m.set('key', 'value')
  assert.equal(await m.has('key'), true)
  await m.clear()
  assert.end()
})

test('get', async (assert) => {
  const m = new Storage('test', StringSchema, new StorageEngineMock())
  assert.equal(await m.get('key'), undefined)
  await m.set('key', 'value')
  assert.equal(await m.get('key'), 'value')
  await m.clear()
  assert.end()
})

test('set', async (assert) => {
  const m = new Storage('test', StringSchema, new StorageEngineMock())
  assert.equal(await m.get('key'), undefined)
  assert.equal(await m.set('key', 'value'), m)
  assert.equal(await m.get('key'), 'value')
  await m.clear()
  assert.end()
})

test('delete', async (assert) => {
  const m = new Storage('test', StringSchema, new StorageEngineMock())
  assert.equal(await m.get('key'), undefined)
  assert.equal(await m.delete('key'), false)
  await m.set('key', 'value')
  assert.equal(await m.get('key'), 'value')
  assert.equal(await m.delete('key'), true)
  assert.equal(await m.get('key'), undefined)
  assert.equal(await m.delete('key'), false)
  await m.clear()
  assert.end()
})

test('clear', async (assert) => {
  const m = new Storage('test', StringSchema, new StorageEngineMock())
  const m2 = new Storage('test2', StringSchema, new StorageEngineMock())
  await m.set('key', 'value')
  await m2.set('key', 'value2')
  assert.equal(await m.get('key'), 'value')
  assert.equal(await m2.get('key'), 'value2')
  await m.clear()
  assert.equal(await m2.get('key'), 'value2')
  assert.equal(await m.get('key'), undefined)
  await m2.clear()
  assert.end()
})

test('keys', async (assert) => {
  const m = new Storage('test', StringSchema, new StorageEngineMock())
  assert.deepEqual(Array.from(await m.keys()), [])
  await m.set('key', 'value')
  assert.deepEqual(Array.from(await m.keys()), ['key'])
  await m.set('key2', 'value2')
  assert.deepEqual(Array.from(await m.keys()), ['key', 'key2'])
  await m.set('key', 'value')
  assert.deepEqual(Array.from(await m.keys()), ['key', 'key2'])
  await m.clear()
  assert.end()
})

test('values', async (assert) => {
  const m = new Storage('test', StringSchema, new StorageEngineMock())
  assert.deepEqual(Array.from(await m.values()), [])
  await m.set('key', 'value')
  assert.deepEqual(Array.from(await m.values()), ['value'])
  await m.set('key2', 'value2')
  assert.deepEqual(Array.from(await m.values()), ['value', 'value2'])
  await m.set('key', 'value')
  assert.deepEqual(Array.from(await m.values()), ['value', 'value2'])
  await m.clear()
  assert.end()
})

test('entries', async (assert) => {
  const m = new Storage('test', StringSchema, new StorageEngineMock())
  assert.deepEqual(Array.from(await m.entries()), [])
  await m.set('key', 'value')
  assert.deepEqual(Array.from(await m.entries()), [['key', 'value']])
  await m.set('key2', 'value2')
  assert.deepEqual(Array.from(await m.entries()), [
    ['key', 'value'],
    ['key2', 'value2'],
  ])
  await m.set('key', 'value')
  assert.deepEqual(Array.from(await m.entries()), [
    ['key', 'value'],
    ['key2', 'value2'],
  ])
  await m.clear()
  assert.end()
})
