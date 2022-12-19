import t from 'tape'
import ExtLocalMap from './ext-local'

const test = ExtLocalMap.isSupported() ? t : t.skip

test('has', async (assert) => {
  const m = new ExtLocalMap('test')
  assert.equal(await m.has('key'), false)
  await m.set('key', 'value')
  assert.equal(await m.has('key'), true)
  await m.clear()
  assert.end()
})

test('get', async (assert) => {
  const m = new ExtLocalMap('test')
  assert.equal(await m.get('key'), undefined)
  await m.set('key', 'value')
  assert.equal(await m.get('key'), 'value')
  await m.clear()
  assert.end()
})

test('set', async (assert) => {
  const m = new ExtLocalMap('test')
  assert.equal(await m.get('key'), undefined)
  assert.equal(await m.set('key', 'value'), m)
  assert.equal(await m.get('key'), 'value')
  await m.clear()
  assert.end()
})

test('delete', async (assert) => {
  const m = new ExtLocalMap('test')
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
  const m = new ExtLocalMap('test')
  const m2 = new ExtLocalMap('test2')
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
  const m = new ExtLocalMap('test')
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
  const m = new ExtLocalMap('test')
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
  const m = new ExtLocalMap('test')
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
