import { create } from 'zustand'

export type ModalStore = {
  transactionModalOpen: boolean
  handleTransaction: (params: any) => Promise<boolean>
  handleTransactionDecision: (decision: boolean) => void
  transactionPromise: [Function, Function] | null
  // TODO this should not be any
  currentTransactionDetails: any | null

  connectionModalOpen: boolean
  handleConnection: (params: any) => Promise<boolean>
  handleConnectionDecision: (decision: boolean) => void
  connectionPromise: [Function, Function] | null
  // TODO this should not be any
  currentConnectionDetails: any | null
}

export const useModalStore = create<ModalStore>()((set, get) => ({
  transactionModalOpen: false,
  currentTransactionDetails: null,
  transactionPromise: null,
  handleTransactionDecision: (decision: boolean) => {
    get().transactionPromise?.[0](decision)
    set({
      transactionPromise: null,
      currentTransactionDetails: null,
      transactionModalOpen: false
    })
  },
  handleTransaction: async (params: any) => {
    set({
      transactionModalOpen: true
    })
    const transactionPromise = new Promise<boolean>((resolve, reject) => {
      set({
        currentTransactionDetails: params,
        transactionPromise: [resolve, reject]
      })
    })
    const result = await transactionPromise
    return result
  },

  currentConnectionDetails: null,
  connectionPromise: null,
  connectionModalOpen: false,
  handleConnectionDecision: (decision: boolean) => {
    get().connectionPromise?.[0](decision)
    set({
      connectionPromise: null,
      currentConnectionDetails: null,
      connectionModalOpen: false
    })
  },
  handleConnection: async (params: any) => {
    set({
      connectionModalOpen: true
    })
    const connectionPromise = new Promise<boolean>((resolve, reject) => {
      set({
        currentConnectionDetails: params,
        connectionPromise: [resolve, reject]
      })
    })
    const result = await connectionPromise
    return result
  }
}))
