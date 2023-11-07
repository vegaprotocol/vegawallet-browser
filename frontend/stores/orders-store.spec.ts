import { useOrdersStore } from './orders-store'

const mockOrderData = { id: 'some-id', name: 'Test Order' }

describe('Orders Store', () => {
  const initialOrderState = useOrdersStore.getState()
  let requestMock: jest.Mock

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(0)
  })

  beforeEach(() => {
    useOrdersStore.setState(initialOrderState)
    requestMock = jest.fn()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should set loading to true when getOrderById is called', async () => {
    requestMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          Promise.resolve().then(() => {
            resolve({ order: {} })
          })
        })
    )

    useOrdersStore.setState({ loading: false })
    const promise = useOrdersStore.getState().getOrderById('some-id', requestMock)
    expect(useOrdersStore.getState().loading).toBe(true)
    await promise
    expect(useOrdersStore.getState().loading).toBe(false)
  })

  it('should set loading to false when getOrderById is done', async () => {
    requestMock.mockResolvedValue({ order: mockOrderData })
    await useOrdersStore.getState().getOrderById('some-id', requestMock)
    expect(useOrdersStore.getState().loading).toBe(false)
  })

  it('should set the order when found', async () => {
    requestMock.mockResolvedValue({ order: mockOrderData })

    await useOrdersStore.getState().getOrderById('some-id', requestMock)
    expect(useOrdersStore.getState().order).toEqual(mockOrderData)
  })

  it('should set lastUpdated after getOrderById is done', async () => {
    useOrdersStore.setState({ lastUpdated: null })
    requestMock.mockResolvedValue({ order: mockOrderData })
    await useOrdersStore.getState().getOrderById('some-id', requestMock)
    expect(useOrdersStore.getState().lastUpdated).toBe(0)
  })

  it('should set error state if an unexpected error occurs', async () => {
    const errorMessage = 'unexpected error'
    requestMock.mockRejectedValue(new Error(errorMessage))

    await useOrdersStore.getState().getOrderById('some-id', requestMock)
    expect(useOrdersStore.getState().error?.message).toBe(errorMessage)
  })
})
