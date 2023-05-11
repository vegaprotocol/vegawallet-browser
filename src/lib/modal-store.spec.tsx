import { useModalStore } from './modal-store'

const initialState = useModalStore.getState()

describe('Store', () => {
  beforeEach(() => {
    useModalStore.setState(initialState)
  })
  it('sets connection modal open to appropriate value', () => {
    expect(useModalStore.getState().connectionModalOpen).toBe(false)
    useModalStore.getState().setConnectionModalOpen(true)
    expect(useModalStore.getState().connectionModalOpen).toBe(true)
    useModalStore.getState().setConnectionModalOpen(false)
    expect(useModalStore.getState().connectionModalOpen).toBe(false)
  })
  it('sets transaction modal open to appropriate value', () => {
    expect(useModalStore.getState().transactionModalOpen).toBe(false)
    useModalStore.getState().setTransactionModalOpen(true)
    expect(useModalStore.getState().transactionModalOpen).toBe(true)
    useModalStore.getState().setTransactionModalOpen(false)
    expect(useModalStore.getState().transactionModalOpen).toBe(false)
  })
})
