import { TransactionMessage } from '../lib/transactions'
import { useInteractionStore } from './interaction-store'

const initialState = useInteractionStore.getState()

const mockMessage = {
  transaction: {},
  publicKey: 'foo',
  name: 'bar',
  wallet: 'baz',
  sendingMode: 'TYPE_SYNC',
  origin: 'qux',
  receivedAt: new Date().toISOString()
} as TransactionMessage

describe('ModalStore', () => {
  beforeEach(() => {
    useInteractionStore.setState(initialState)
  })
  it('transaction modal sets modal as open and resolves promise with value', () => {
    expect(useInteractionStore.getState().transactionModalOpen).toBe(false)
    expect(useInteractionStore.getState().transactionPromise).toBe(null)
    const promise = useInteractionStore.getState().handleTransaction(mockMessage)
    expect(useInteractionStore.getState().transactionModalOpen).toBe(true)
    expect(useInteractionStore.getState().transactionPromise).not.toBe(null)
    useInteractionStore.getState().handleTransactionDecision(true)
    expect(useInteractionStore.getState().transactionModalOpen).toBe(false)
    expect(useInteractionStore.getState().transactionPromise).toBe(null)
    expect(useInteractionStore.getState().currentTransactionDetails).toBe(null)
    return expect(promise).resolves.toBe(true)
  })
  it('transaction resolves with false if not approved', () => {
    expect(useInteractionStore.getState().transactionModalOpen).toBe(false)
    expect(useInteractionStore.getState().transactionPromise).toBe(null)
    const promise = useInteractionStore.getState().handleTransaction(mockMessage)
    expect(useInteractionStore.getState().transactionModalOpen).toBe(true)
    expect(useInteractionStore.getState().transactionPromise).not.toBe(null)
    useInteractionStore.getState().handleTransactionDecision(false)
    expect(useInteractionStore.getState().transactionModalOpen).toBe(false)
    expect(useInteractionStore.getState().transactionPromise).toBe(null)
    expect(useInteractionStore.getState().currentTransactionDetails).toBe(null)
    return expect(promise).resolves.toBe(false)
  })
  // TODO this should throw an error but until sync across windows is implemented it will not
  it('transaction clears state when promise could not be found', () => {
    useInteractionStore.setState({
      transactionModalOpen: true,
      transactionPromise: null,
      currentTransactionDetails: {} as any
    })
    useInteractionStore.getState().handleTransactionDecision(false)
    expect(useInteractionStore.getState().transactionModalOpen).toBe(false)
    expect(useInteractionStore.getState().transactionPromise).toBe(null)
    expect(useInteractionStore.getState().currentTransactionDetails).toBe(null)
  })
  it('connection modal sets modal as open and resolves promise with value', () => {
    expect(useInteractionStore.getState().connectionModalOpen).toBe(false)
    expect(useInteractionStore.getState().connectionPromise).toBe(null)
    const promise = useInteractionStore.getState().handleConnection(mockMessage)
    expect(useInteractionStore.getState().connectionModalOpen).toBe(true)
    expect(useInteractionStore.getState().connectionPromise).not.toBe(null)
    useInteractionStore.getState().handleConnectionDecision(true)
    expect(useInteractionStore.getState().connectionModalOpen).toBe(false)
    expect(useInteractionStore.getState().connectionPromise).toBe(null)
    expect(useInteractionStore.getState().currentConnectionDetails).toBe(null)
    return expect(promise).resolves.toBe(true)
  })
  it('connection resolves with false if not approved', () => {
    expect(useInteractionStore.getState().connectionModalOpen).toBe(false)
    expect(useInteractionStore.getState().connectionPromise).toBe(null)
    const promise = useInteractionStore.getState().handleConnection(mockMessage)
    expect(useInteractionStore.getState().connectionModalOpen).toBe(true)
    expect(useInteractionStore.getState().connectionPromise).not.toBe(null)
    useInteractionStore.getState().handleConnectionDecision(false)
    expect(useInteractionStore.getState().connectionModalOpen).toBe(false)
    expect(useInteractionStore.getState().connectionPromise).toBe(null)
    expect(useInteractionStore.getState().currentConnectionDetails).toBe(null)
    return expect(promise).resolves.toBe(false)
  })
  // TODO this should throw an error but until sync across windows is implemented it will not
  it('connection clears state when promise could not be found', () => {
    useInteractionStore.setState({
      connectionModalOpen: true,
      connectionPromise: null,
      currentConnectionDetails: {} as any
    })
    useInteractionStore.getState().handleTransactionDecision(false)
    expect(useInteractionStore.getState().transactionModalOpen).toBe(false)
    expect(useInteractionStore.getState().transactionPromise).toBe(null)
    expect(useInteractionStore.getState().currentTransactionDetails).toBe(null)
  })
})
