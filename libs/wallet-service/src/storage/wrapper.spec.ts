import { z } from 'zod'
import { Storage } from './wrapper'
import { MockStorage } from '../../test/mock-storage'

const StringSchema = z.string()

describe('Storage', () => {
  const m = new Storage<string>('test', StringSchema, new MockStorage())

  afterEach(async () => {
    await m.clear()
  })

  test('has', async () => {
    expect(await m.has('key')).toBe(false)
    await m.set('key', 'value')
    expect(await m.has('key')).toBe(true)
  })

  test('get', async () => {
    expect(await m.get('key')).toBe(undefined)
    await m.set('key', 'value')
    expect(await m.get('key')).toBe('value')
  })

  test('set', async () => {
    expect(await m.get('key')).toBe(undefined)
    await m.set('key', 'value')
    expect(await m.get('key')).toBe('value')
  })

  test('delete', async () => {
    expect(await m.get('key')).toBe(undefined)
    expect(await m.delete('key')).toBe(false)
    await m.set('key', 'value')
    expect(await m.get('key')).toBe('value')
    expect(await m.delete('key')).toBe(true)
    expect(await m.get('key')).toBe(undefined)
    expect(await m.delete('key')).toBe(false)
  })

  test('clear', async () => {
    const m2 = new Storage('test2', StringSchema, new MockStorage())
    await m.set('key', 'value')
    await m2.set('key', 'value2')
    expect(await m.get('key')).toBe('value')
    expect(await m2.get('key')).toBe('value2')
    await m.clear()
    expect(await m2.get('key')).toBe('value2')
    expect(await m.get('key')).toBe(undefined)
  })

  test('keys', async () => {
    expect(Array.from(await m.keys())).toEqual([])
    await m.set('key', 'value')
    expect(Array.from(await m.keys())).toEqual(['key'])
    await m.set('key2', 'value2')
    expect(Array.from(await m.keys())).toEqual(['key', 'key2'])
    await m.set('key', 'value')
    expect(Array.from(await m.keys())).toEqual(['key', 'key2'])
  })

  test('values', async () => {
    expect(Array.from(await m.values())).toEqual([])
    await m.set('key', 'value')
    expect(Array.from(await m.values())).toEqual(['value'])
    await m.set('key2', 'value2')
    expect(Array.from(await m.values())).toEqual(['value', 'value2'])
    await m.set('key', 'value')
    expect(Array.from(await m.values())).toEqual(['value', 'value2'])
  })

  test('entries', async () => {
    expect(Array.from(await m.entries())).toEqual([])
    await m.set('key', 'value')
    expect(Array.from(await m.entries())).toEqual([['key', 'value']])
    await m.set('key2', 'value2')
    expect(Array.from(await m.entries())).toEqual([
      ['key', 'value'],
      ['key2', 'value2'],
    ])
    await m.set('key', 'value')
    expect(Array.from(await m.entries())).toEqual([
      ['key', 'value'],
      ['key2', 'value2'],
    ])
  })
})
