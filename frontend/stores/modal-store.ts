import { create } from 'zustand'
import { TransactionMessage } from '../lib/transactions'

export interface ConnectionMessage {
  origin: string
  receivedAt: string
}

export type ModalStore = {
  transactionModalOpen: boolean
  handleTransaction: (params: TransactionMessage) => Promise<boolean>
  handleTransactionDecision: (decision: boolean) => void
  transactionPromise: [Function, Function] | null
  currentTransactionDetails: TransactionMessage | null

  connectionModalOpen: boolean
  handleConnection: (params: ConnectionMessage) => Promise<boolean>
  handleConnectionDecision: (decision: boolean) => void
  connectionPromise: [Function, Function] | null
  currentConnectionDetails: ConnectionMessage | null
}

export const useModalStore = create<ModalStore>()((set, get) => ({
  transactionModalOpen: false,
  currentTransactionDetails: null,
  transactionPromise: null,
  handleTransactionDecision: (decision: boolean) => {
    const promise = get().transactionPromise
    if (promise) {
      promise[0](decision)
    }
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
    const promise = get().connectionPromise
    if (promise) {
      promise[0](decision)
    }
    set({
      connectionPromise: null,
      currentConnectionDetails: null,
      connectionModalOpen: false
    })
  },
  handleConnection: async (params: ConnectionMessage) => {
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
