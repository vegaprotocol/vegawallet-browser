import { create } from 'zustand'

export type ModalStore = {
  connectionModalOpen: boolean
  setConnectionModalOpen: (open: boolean) => void
  transactionModalOpen: boolean
  setTransactionModalOpen: (open: boolean) => void
}

export const useModalStore = create<ModalStore>()((set, get) => ({
  connectionModalOpen: false,
  transactionModalOpen: false,
  setConnectionModalOpen: (open: boolean) => {
    set({
      connectionModalOpen: open
    })
  },
  setTransactionModalOpen: (open: boolean) => {
    set({
      transactionModalOpen: open
    })
  }
}))
