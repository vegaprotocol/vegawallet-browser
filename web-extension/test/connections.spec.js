import { ConnectionsCollection } from '../backend/connections.js'
import ConcurrentStorage from '../lib/concurrent-storage.js'

describe('ConnectionsCollection', () => {
  it('should be allowed on static key set', async () => {
    const connectionsStore = new ConcurrentStorage(new Map())
    const publicKeyIndexStore = new ConcurrentStorage(new Map())

    const connections = new ConnectionsCollection({
      connectionsStore,
      publicKeyIndexStore
    })

    await publicKeyIndexStore.set('123', { publicKey: '123', wallet: 'w1', name: 'k1' })
    await publicKeyIndexStore.set('321', { publicKey: '321', wallet: 'w1', name: 'k2' })
    await publicKeyIndexStore.set('443', { publicKey: '443', wallet: 'w2', name: 'k3' })

    await connections.set('https://example.com', {
      allowList: {
        wallets: ['w2'],
        publicKeys: []
      }
    })

    expect(await connections.isAllowed('https://example.com', '123')).toBe(false)
    expect(await connections.isAllowed('https://example.com', '321')).toBe(false)
    expect(await connections.isAllowed('https://example.com', '443')).toBe(true)
    expect(await connections.listAllowedKeys('https://example.com')).toEqual([{ publicKey: '443', name: 'k3' }])

    await connections.set('https://example.com', {
      allowList: {
        wallets: ['w1'],
        publicKeys: []
      }
    })

    expect(await connections.isAllowed('https://example.com', '123')).toBe(true)
    expect(await connections.isAllowed('https://example.com', '321')).toBe(true)
    expect(await connections.isAllowed('https://example.com', '443')).toBe(false)
    expect(await connections.listAllowedKeys('https://example.com')).toEqual([
      { publicKey: '123', name: 'k1' },
      { publicKey: '321', name: 'k2' }
    ])

    await connections.set('https://example.com', {
      allowList: {
        wallets: [],
        publicKeys: ['123', '443']
      }
    })

    expect(await connections.isAllowed('https://example.com', '123')).toBe(true)
    expect(await connections.isAllowed('https://example.com', '321')).toBe(false)
    expect(await connections.isAllowed('https://example.com', '443')).toBe(true)
    expect(await connections.listAllowedKeys('https://example.com')).toEqual([
      { publicKey: '123', name: 'k1' },
      { publicKey: '443', name: 'k3' }
    ])

    await connections.set('https://example.com', {
      allowList: {
        wallets: [],
        publicKeys: []
      }
    })

    expect(await connections.isAllowed('https://example.com', '123')).toBe(false)
    expect(await connections.isAllowed('https://example.com', '321')).toBe(false)
    expect(await connections.isAllowed('https://example.com', '443')).toBe(false)
    expect(await connections.listAllowedKeys('https://example.com')).toEqual([])

    await connections.set('https://example.com', {
      allowList: {
        wallets: ['w1', 'w2'],
        publicKeys: []
      }
    })

    expect(await connections.isAllowed('https://example.com', '123')).toBe(true)
    expect(await connections.isAllowed('https://example.com', '321')).toBe(true)
    expect(await connections.isAllowed('https://example.com', '443')).toBe(true)
    expect(await connections.listAllowedKeys('https://example.com')).toEqual([
      { publicKey: '123', name: 'k1' },
      { publicKey: '321', name: 'k2' },
      { publicKey: '443', name: 'k3' }
    ])
  })

  it('should be allowed on dynamic key set', async () => {
    const connectionsStore = new ConcurrentStorage(new Map())
    const publicKeyIndexStore = new ConcurrentStorage(new Map())

    const connections = new ConnectionsCollection({
      connectionsStore,
      publicKeyIndexStore
    })

    await publicKeyIndexStore.set('123', { publicKey: '123', wallet: 'w1', name: 'k1' })

    await connections.set('https://example.com', {
      chainId: 'chainId',
      networkId: 'networkId',
      allowList: {
        wallets: ['w1'],
        publicKeys: []
      }
    })

    expect(await connections.isAllowed('https://example.com', '123')).toBe(true)
    expect(await connections.listAllowedKeys('https://example.com')).toEqual([{ publicKey: '123', name: 'k1' }])

    await publicKeyIndexStore.set('321', { publicKey: '321', wallet: 'w1', name: 'k2' })

    expect(await connections.isAllowed('https://example.com', '321')).toBe(true)
    expect(await connections.listAllowedKeys('https://example.com')).toEqual([
      { publicKey: '123', name: 'k1' },
      { publicKey: '321', name: 'k2' }
    ])

    await publicKeyIndexStore.delete('123')

    expect(await connections.isAllowed('https://example.com', '123')).toBe(false)
    expect(await connections.listAllowedKeys('https://example.com')).toEqual([{ publicKey: '321', name: 'k2' }])

    await publicKeyIndexStore.delete('321')

    expect(await connections.isAllowed('https://example.com', '321')).toBe(false)
    expect(await connections.listAllowedKeys('https://example.com')).toEqual([])
  })

  it('should emit events set/delete', async () => {
    jest.useFakeTimers().setSystemTime(0)

    const connectionsStore = new ConcurrentStorage(new Map())
    const publicKeyIndexStore = new ConcurrentStorage(new Map())

    const connections = new ConnectionsCollection({
      connectionsStore,
      publicKeyIndexStore
    })

    const deleteListener = jest.fn()
    const setListener = jest.fn()
    connections.on('set', setListener)
    connections.on('delete', deleteListener)

    await publicKeyIndexStore.set('123', { publicKey: '123', wallet: 'w1', name: 'k1' })

    await connections.set('https://example.com', {
      origin: 'https://example.com',
      networkId: null,
      chainId: null,
      allowList: { wallets: ['w1'], publicKeys: [] },
      accessedAt: 0
    })

    expect(setListener).toHaveBeenCalledWith({
      origin: 'https://example.com',
      networkId: null,
      chainId: null,
      allowList: { wallets: ['w1'], publicKeys: [] },
      accessedAt: 0
    })

    expect(await connections.list()).toEqual([
      {
        origin: 'https://example.com',
        allowList: { wallets: ['w1'], publicKeys: [] },
        accessedAt: 0,
        networkId: null,
        chainId: null
      }
    ])

    await connections.delete('https://example.com')
    expect(deleteListener).toHaveBeenCalledWith({ origin: 'https://example.com' })

    expect(await connections.list()).toEqual([])

    jest.useRealTimers()
  })

  it('should emit events disconnect', async () => {
    const connectionsStore = new ConcurrentStorage(new Map())
    const publicKeyIndexStore = new ConcurrentStorage(new Map())

    const connections = new ConnectionsCollection({
      connectionsStore,
      publicKeyIndexStore
    })

    const listener = jest.fn()
    connections.on('delete', listener)

    await connections.delete('*')
    expect(listener).toHaveBeenCalledWith({ origin: '*' })

    await connections.delete('https://example.com')
    expect(listener).toHaveBeenCalledWith({ origin: 'https://example.com' })
  })

  it('should order origins by last accessed', async () => {
    jest.useFakeTimers().setSystemTime(0)

    const connectionsStore = new ConcurrentStorage(new Map())
    const publicKeyIndexStore = new ConcurrentStorage(new Map())

    const connections = new ConnectionsCollection({
      connectionsStore,
      publicKeyIndexStore
    })

    await publicKeyIndexStore.set('123', { publicKey: '123', wallet: 'w1', name: 'k1' })

    await connections.set('https://example.com', {
      allowList: {
        wallets: ['w1'],
        publicKeys: []
      }
    })

    jest.setSystemTime(1000)

    await connections.set('https://example.org', {
      allowList: {
        wallets: ['w1'],
        publicKeys: []
      }
    })

    jest.setSystemTime(2000)

    await connections.set('https://example.net', {
      allowList: {
        wallets: ['w1'],
        publicKeys: []
      }
    })

    expect(await connections.list()).toEqual([
      {
        origin: 'https://example.net',
        allowList: { wallets: ['w1'], publicKeys: [] },
        accessedAt: 2000,
        chainId: null,
        networkId: null
      },
      {
        origin: 'https://example.org',
        allowList: { wallets: ['w1'], publicKeys: [] },
        accessedAt: 1000,
        chainId: null,
        networkId: null
      },
      {
        origin: 'https://example.com',
        allowList: { wallets: ['w1'], publicKeys: [] },
        accessedAt: 0,
        chainId: null,
        networkId: null
      }
    ])

    jest.setSystemTime(3000)

    await connections.touch('https://example.org')

    expect(await connections.list()).toEqual([
      {
        chainId: null,
        networkId: null,
        origin: 'https://example.org',
        allowList: { wallets: ['w1'], publicKeys: [] },
        accessedAt: 3000
      },
      {
        chainId: null,
        networkId: null,
        origin: 'https://example.net',
        allowList: { wallets: ['w1'], publicKeys: [] },
        accessedAt: 2000
      },
      {
        chainId: null,
        networkId: null,
        origin: 'https://example.com',
        allowList: { wallets: ['w1'], publicKeys: [] },
        accessedAt: 0
      }
    ])

    jest.useRealTimers()
  })
})
