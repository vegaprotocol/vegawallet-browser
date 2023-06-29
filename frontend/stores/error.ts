import { create } from 'zustand'

export type ErrorStore = {
  error: Error | null
  clearError: () => void
  setError: (error: Error) => void
}

export const useErrorStore = create<ErrorStore>()((set) => ({
  error: null,
  setError(error: Error) {
    set({ error: error })
  },
  clearError() {
    set({ error: null })
  }
}))
