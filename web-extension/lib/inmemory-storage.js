export default class StorageMemoryMap extends Map {
  getMany(keys) {
    return keys.map(key => this.get(key))
  }

  setMany(obj) {
    for (const [key, value] of Object.entries(obj)) {
      this.set(key, value)
    }
    return this
  }
}
