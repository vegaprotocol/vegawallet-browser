import { create } from 'zustand'

import { TransactionMessage } from '@/lib/transactions'

export interface ConnectionMessage {
  origin: string
  chainId: string
  receivedAt: string
}

export interface ConnectionReply {
  approved: boolean
  networkId?: string
}

export type InteractionStore = {
  transactionModalOpen: boolean
  handleTransaction: (parameters: TransactionMessage) => Promise<boolean>
  handleTransactionDecision: (decision: boolean) => void
  transactionPromise: [Function, Function] | null
  currentTransactionDetails: TransactionMessage | null

  connectionModalOpen: boolean
  handleConnection: (parameters: ConnectionMessage) => Promise<ConnectionReply>
  handleConnectionDecision: (decision: ConnectionReply) => void
  connectionPromise: [Function, Function] | null
  currentConnectionDetails: ConnectionMessage | null
}

export const useInteractionStore = create<InteractionStore>()((set, get) => ({
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
  handleTransaction: async (parameters: any) => {
    set({
      transactionModalOpen: true
    })
    const transactionPromise = new Promise<boolean>((resolve, reject) => {
      set({
        currentTransactionDetails: parameters,
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
  handleConnection: async (parameters: ConnectionMessage) => {
    set({
      connectionModalOpen: true
    })
    const connectionPromise = new Promise<boolean>((resolve, reject) => {
      set({
        currentConnectionDetails: parameters,
        connectionPromise: [resolve, reject]
      })
    })
    const result = await connectionPromise
    return result
  }
}))
