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

    const server = initClientServer({
      settings: new ConcurrentStorage(new Map([['selectedNetwork', 'fairground']])),
      wallets: new WalletCollection({
        walletsStore: new EncryptedStorage(new Map(), { memory: 10, iterations: 1 }),
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

    expect(res).toBe(null)
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

    expect(res2).toBe(null)
    expect(context.isConnected).toBe(false)
    expect(await connections.has(context.origin)).toBe(true)
  })
})
