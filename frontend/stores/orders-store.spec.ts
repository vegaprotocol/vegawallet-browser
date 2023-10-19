import { act } from '@testing-library/react'
import { useOrdersStore } from './orders-store'

const mockOrderData = { id: 'some-id', name: 'Test Order' }

describe('Orders Store', () => {
  const initialOrderState = useOrdersStore.getState()
  let requestMock: jest.Mock

  beforeAll(() => {
    jest.useFakeTimers()
    Date.now = jest.fn(() => 0)
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

    await act(async () => {
      const promise = useOrdersStore.getState().getOrderById('some-id', requestMock)
      expect(useOrdersStore.getState().loading).toBe(true)

      // Wait for promise to resolve to proceed with other tests
      await promise
    })
  })

  it('should set loading to false when getOrderById is done', async () => {
    requestMock.mockResolvedValue({ order: mockOrderData })
    await useOrdersStore.getState().getOrderById('some-id', requestMock)
    expect(useOrdersStore.getState().loading).toBe(false)
  })

  it('should return the correct order and lastUpdated when found', async () => {
    requestMock.mockResolvedValue({ order: mockOrderData })

    const { order, lastUpdated } = await useOrdersStore.getState().getOrderById('some-id', requestMock)

    expect(order).toEqual(mockOrderData)
    expect(typeof lastUpdated).toBe('number')
  })

  it('should return the correct order and lastUpdated value when found', async () => {
    requestMock.mockResolvedValue({ order: mockOrderData })

    const retrievedOrder = await useOrdersStore.getState().getOrderById('some-id', requestMock)
    expect(retrievedOrder).toEqual({ order: mockOrderData, lastUpdated: 0 })
  })

  it('should throw an error if order not found', async () => {
    requestMock.mockResolvedValue({})

    await expect(useOrdersStore.getState().getOrderById('some-id', requestMock)).rejects.toThrow(
      'Order with id some-id not found'
    )
  })
})
