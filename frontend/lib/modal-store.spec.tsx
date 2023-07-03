import { useModalStore } from './modal-store'

const initialState = useModalStore.getState()

const mockMessage = {
  transaction: {},
  publicKey: 'foo',
  name: 'bar',
  wallet: 'baz',
  sendingMode: 'TYPE_SYNC',
  origin: 'qux',
  receivedAt: new Date().toISOString()
}

describe('ModalStore', () => {
  beforeEach(() => {
    useModalStore.setState(initialState)
  })
  it('transaction modal sets modal as open and resolves promise with value', () => {
    expect(useModalStore.getState().transactionModalOpen).toBe(false)
    expect(useModalStore.getState().transactionPromise).toBe(null)
    const promise = useModalStore.getState().handleTransaction(mockMessage)
    expect(useModalStore.getState().transactionModalOpen).toBe(true)
    expect(useModalStore.getState().transactionPromise).not.toBe(null)
    useModalStore.getState().handleTransactionDecision(true)
    expect(useModalStore.getState().transactionModalOpen).toBe(false)
    expect(useModalStore.getState().transactionPromise).toBe(null)
    expect(useModalStore.getState().currentTransactionDetails).toBe(null)
    return expect(promise).resolves.toBe(true)
  })
  it('transaction resolves with false if not approved', () => {
    expect(useModalStore.getState().transactionModalOpen).toBe(false)
    expect(useModalStore.getState().transactionPromise).toBe(null)
    const promise = useModalStore.getState().handleTransaction(mockMessage)
    expect(useModalStore.getState().transactionModalOpen).toBe(true)
    expect(useModalStore.getState().transactionPromise).not.toBe(null)
    useModalStore.getState().handleTransactionDecision(false)
    expect(useModalStore.getState().transactionModalOpen).toBe(false)
    expect(useModalStore.getState().transactionPromise).toBe(null)
    expect(useModalStore.getState().currentTransactionDetails).toBe(null)
    return expect(promise).resolves.toBe(false)
  })
  // TODO this should throw an error but until sync across windows is implemented it will not
  it('transaction clears state when promise could not be found', () => {
    useModalStore.setState({
      transactionModalOpen: true,
      transactionPromise: null,
      currentTransactionDetails: {} as any
    })
    useModalStore.getState().handleTransactionDecision(false)
    expect(useModalStore.getState().transactionModalOpen).toBe(false)
    expect(useModalStore.getState().transactionPromise).toBe(null)
    expect(useModalStore.getState().currentTransactionDetails).toBe(null)
  })
  it('connection modal sets modal as open and resolves promise with value', () => {
    expect(useModalStore.getState().connectionModalOpen).toBe(false)
    expect(useModalStore.getState().connectionPromise).toBe(null)
    const promise = useModalStore.getState().handleConnection(mockMessage)
    expect(useModalStore.getState().connectionModalOpen).toBe(true)
    expect(useModalStore.getState().connectionPromise).not.toBe(null)
    useModalStore.getState().handleConnectionDecision(true)
    expect(useModalStore.getState().connectionModalOpen).toBe(false)
    expect(useModalStore.getState().connectionPromise).toBe(null)
    expect(useModalStore.getState().currentConnectionDetails).toBe(null)
    return expect(promise).resolves.toBe(true)
  })
  it('connection resolves with false if not approved', () => {
    expect(useModalStore.getState().connectionModalOpen).toBe(false)
    expect(useModalStore.getState().connectionPromise).toBe(null)
    const promise = useModalStore.getState().handleConnection(mockMessage)
    expect(useModalStore.getState().connectionModalOpen).toBe(true)
    expect(useModalStore.getState().connectionPromise).not.toBe(null)
    useModalStore.getState().handleConnectionDecision(false)
    expect(useModalStore.getState().connectionModalOpen).toBe(false)
    expect(useModalStore.getState().connectionPromise).toBe(null)
    expect(useModalStore.getState().currentConnectionDetails).toBe(null)
    return expect(promise).resolves.toBe(false)
  })
  // TODO this should throw an error but until sync across windows is implemented it will not
  it('connection clears state when promise could not be found', () => {
    useModalStore.setState({
      connectionModalOpen: true,
      connectionPromise: null,
      currentConnectionDetails: {} as any
    })
    useModalStore.getState().handleTransactionDecision(false)
    expect(useModalStore.getState().transactionModalOpen).toBe(false)
    expect(useModalStore.getState().transactionPromise).toBe(null)
    expect(useModalStore.getState().currentTransactionDetails).toBe(null)
  })
})
