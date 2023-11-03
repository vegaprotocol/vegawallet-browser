import { StorageSessionMap, StorageLocalMap } from '../lib/storage.js'

describe('StorageSessionMap', () => {
  it('should not be supported in Node.js', () => {
    expect(() => new StorageSessionMap('test')).to.throw()
    expect(StorageSessionMap.isSupported()).toBe(false)
  })
})

describe('StorageLocalMap', () => {
  it('should not be supported in Node.js', () => {
    expect(() => new StorageLocalMap('test')).to.throw()
    expect(StorageLocalMap.isSupported()).toBe(false)
  })
})
