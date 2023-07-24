import initClientServer from '../backend/client-ns.js'
import { WalletCollection } from '../backend/wallets.js'
import { NetworkCollection } from '../backend/network.js'
import { ConnectionsCollection } from '../backend/connections.js'
import ConcurrentStorage from '../lib/concurrent-storage.js'
import EncryptedStorage from '../lib/encrypted-storage.js'

describe('client-ns', () => {
  it('should connect, then disconnect', async () => {
    const publicKeyIndexStore = new ConcurrentStorage(new Map())
    const connections = new ConnectionsCollection({
      connectionsStore: new ConcurrentStorage(new Map()),
      publicKeyIndexStore
    })

    const interactor = {
      reviewConnection() {
        return true
      },
      reviewTransaction() {
        return true
      }
    }

    const enc = new EncryptedStorage(new Map(), { memory: 10, iterations: 1 })
    await enc.create()

    const server = initClientServer({
      settings: new ConcurrentStorage(new Map([['selectedNetwork', 'fairground']])),
      wallets: new WalletCollection({
        walletsStore: enc,
        publicKeyIndexStore
      }),
      networks: new NetworkCollection(new Map([['fairground', { name: 'Fairground', rest: [] }]])),
      connections,
      interactor,
      onerror(err) {
        throw err
      }
    })

    const context = {
      origin: 'https://example.com'
    }

    const res = await server.onrequest(
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'client.connect_wallet',
        params: null
      },
      context
    )

    expect(res).toMatchObject({
      jsonrpc: '2.0',
      id: 1,
      result: null
    })
    expect(context.isConnected).toBe(true)
    expect(await connections.has(context.origin)).toBe(true)

    const res2 = await server.onrequest(
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'client.disconnect_wallet',
        params: null
      },
      context
    )

    expect(res2).toMatchObject({
      jsonrpc: '2.0',
      id: 2,
      result: null
    })
    expect(context.isConnected).toBe(false)
    expect(await connections.has(context.origin)).toBe(true)
  })

  it('reconnect should update access time', async () => {
    jest.useFakeTimers().setSystemTime(0)

    const publicKeyIndexStore = new ConcurrentStorage(new Map())
    const connections = new ConnectionsCollection({
      connectionsStore: new ConcurrentStorage(new Map()),
      publicKeyIndexStore
    })

    const interactor = {
      reviewConnection() {
        return true
      }
    }

    const enc = new EncryptedStorage(new Map(), { memory: 10, iterations: 1 })
    await enc.create()

    const server = initClientServer({
      settings: new ConcurrentStorage(new Map([['selectedNetwork', 'fairground']])),
      wallets: new WalletCollection({
        walletsStore: enc,
        publicKeyIndexStore
      }),
      networks: new NetworkCollection(new Map([['fairground', { name: 'Fairground', rest: [] }]])),
      connections,
      interactor,
      onerror(err) {
        throw err
      }
    })

    const connectReq = { jsonrpc: '2.0', method: 'client.connect_wallet', params: null }
    const disconnectReq = { jsonrpc: '2.0', method: 'client.disconnect_wallet', params: null }
    const nullRes = { jsonrpc: '2.0', result: null }

    const context = {
      origin: 'https://example.com'
    }

    const res = await server.onrequest({
      ...connectReq,
      id: 1
    }, context)

    expect(res).toMatchObject({
      ...nullRes,
      id: 1

    })

    jest.advanceTimersByTime(1000)

    expect(await connections.list()).toMatchObject([
      {
        origin: 'https://example.com',
        accessedAt: 0
      }
    ])

    const res2 = await server.onrequest({
      ...disconnectReq,
      id: 2
    }, context)

    expect(res2).toMatchObject({
      ...nullRes,
      id: 2
    })

    expect(await connections.list()).toMatchObject([
      {
        origin: 'https://example.com',
        accessedAt: 0
      }
    ])

    const res3 = await server.onrequest({
      ...connectReq,
      id: 3
    }, context)

    expect(res3).toMatchObject({
      ...nullRes,
      id: 3
    })

    expect(await connections.list()).toMatchObject([
      {
        origin: 'https://example.com',
        accessedAt: 1000
      }
    ])

    jest.useRealTimers()
  })
})
