import test from 'tape'
import { z } from 'zod'
import { Storage } from './wrapper'
import { MockStorageEngine } from '../../test/mock-storage'

const StringSchema = z.string()

test('storage has', async (assert) => {
  const m = new Storage<string>('test', StringSchema, new MockStorageEngine())
  assert.equal(await m.has('key'), false)
  await m.set('key', 'value')
  assert.equal(await m.has('key'), true)
})

test('storage get', async (assert) => {
  const m = new Storage<string>('test', StringSchema, new MockStorageEngine())
  assert.equal(await m.get('key'), undefined)
  await m.set('key', 'value')
  assert.equal(await m.get('key'), 'value')
})

test('storage set', async (assert) => {
  const m = new Storage<string>('test', StringSchema, new MockStorageEngine())
  assert.equal(await m.get('key'), undefined)
  await m.set('key', 'value')
  assert.equal(await m.get('key'), 'value')
})

test('storage delete', async (assert) => {
  const m = new Storage<string>('test', StringSchema, new MockStorageEngine())
  assert.equal(await m.get('key'), undefined)
  assert.equal(await m.delete('key'), false)
  await m.set('key', 'value')
  assert.equal(await m.get('key'), 'value')
  assert.equal(await m.delete('key'), true)
  assert.equal(await m.get('key'), undefined)
  assert.equal(await m.delete('key'), false)
})

test('storage clear', async (assert) => {
  const m = new Storage<string>('test', StringSchema, new MockStorageEngine())
  const m2 = new Storage('test2', StringSchema, new MockStorageEngine())
  await m.set('key', 'value')
  await m2.set('key', 'value2')
  assert.equal(await m.get('key'), 'value')
  assert.equal(await m2.get('key'), 'value2')
  await m.clear()
  assert.equal(await m2.get('key'), 'value2')
  assert.equal(await m.get('key'), undefined)
})

test('storage keys', async (assert) => {
  const m = new Storage<string>('test', StringSchema, new MockStorageEngine())
  assert.deepEquals(Array.from(await m.keys()), [])
  await m.set('key', 'value')
  assert.deepEquals(Array.from(await m.keys()), ['key'])
  await m.set('key2', 'value2')
  assert.deepEquals(Array.from(await m.keys()), ['key', 'key2'])
  await m.set('key', 'value')
  assert.deepEquals(Array.from(await m.keys()), ['key', 'key2'])
})

test('storage values', async (assert) => {
  const m = new Storage<string>('test', StringSchema, new MockStorageEngine())
  assert.deepEquals(Array.from(await m.values()), [])
  await m.set('key', 'value')
  assert.deepEquals(Array.from(await m.values()), ['value'])
  await m.set('key2', 'value2')
  assert.deepEquals(Array.from(await m.values()), ['value', 'value2'])
  await m.set('key', 'value')
  assert.deepEquals(Array.from(await m.values()), ['value', 'value2'])
})

test('storage entries', async (assert) => {
  const m = new Storage<string>('test', StringSchema, new MockStorageEngine())
  assert.deepEquals(Array.from(await m.entries()), [])
  await m.set('key', 'value')
  assert.deepEquals(Array.from(await m.entries()), [['key', 'value']])
  await m.set('key2', 'value2')
  assert.deepEquals(Array.from(await m.entries()), [
    ['key', 'value'],
    ['key2', 'value2'],
  ])
  await m.set('key', 'value')
  assert.deepEquals(Array.from(await m.entries()), [
    ['key', 'value'],
    ['key2', 'value2'],
  ])
})
