export class MockStorage {
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
