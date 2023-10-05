import type { StoreApi, UseBoundStore } from 'zustand'

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export function mockStore<T>(store: UseBoundStore<StoreApi<T>>, value: DeepPartial<T>) {
  ;(store as unknown as jest.Mock).mockImplementation((fn) => fn(value))
}
