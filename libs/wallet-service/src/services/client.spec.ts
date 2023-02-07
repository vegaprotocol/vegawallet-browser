import test from 'tape'
import { MockStore } from '../../test/mock-storage'
import { MockEventBus } from '../../test/mock-events'

import { Client } from './client'

test('client - connect', async (assert) => {
  const store = new MockStore()
  const bus = new MockEventBus()
  const client = new Client('test-dapp', store, bus)

  try {
    await client.connect()
    assert.pass('Successfully ran the connect flow')
  } catch (err) {
    assert.fail(`Client connect flow failed: ${(err as Error).message}`)
  }
})

test('client - disconnect', async (assert) => {
  const store = new MockStore()

  await store.connections.set('test-dapp', {
    origin: 'test-dapp',
    wallet: 'test',
    permissions: {
      publicKeys: {
        access: 'read',
        allowedKeys: [],
      },
    },
  })

  const bus = new MockEventBus()
  const client = new Client('test-dapp', store, bus)

  try {
    await client.disconnect()
    assert.pass('Successfully ran the disconnect flow')
  } catch (err) {
    assert.fail(`Client disconnect flow failed: ${(err as Error).message}`)
  }
})

test('client - list keys', async (assert) => {
  const store = new MockStore()
  await store.wallets.set('test', {
    seed: [1],
    keys: [
      {
        index: 1,
        publicKey: '0x0',
        metadata: [
          {
            key: 'name',
            value: 'key1',
          },
        ],
      },
      {
        index: 2,
        publicKey: '0x1',
        metadata: [
          {
            key: 'name',
            value: 'key2',
          },
        ],
      },
    ],
  })
  await store.connections.set('test-dapp', {
    origin: 'test-dapp',
    wallet: 'test',
    permissions: {
      publicKeys: {
        access: 'read',
        allowedKeys: [],
      },
    },
  })

  const bus = new MockEventBus()
  const client = new Client('test-dapp', store, bus)

  try {
    const { keys } = await client.listKeys()
    assert.deepEqual(keys, [
      {
        name: 'key1',
        publicKey: '0x0',
      },
      {
        name: 'key2',
        publicKey: '0x1',
      },
    ])
  } catch (err) {
    assert.fail(`Client list keys failed: ${(err as Error).message}`)
  }
})

test('client - send transaction', async (assert) => {
  const store = new MockStore()
  const bus = new MockEventBus()
  const client = new Client('test-dapp', store, bus)

  try {
    await client.getChainId()
    assert.fail('Client send transaction did not throw an error')
  } catch (err) {
    assert.pass(`Client send transaction: ${(err as Error).message}`)
  }
})

test('client - sign transaction', async (assert) => {
  const store = new MockStore()
  const bus = new MockEventBus()
  const client = new Client('test-dapp', store, bus)

  try {
    await client.getChainId()
    assert.fail('Client sign transaction did not throw an error')
  } catch (err) {
    assert.pass(`Client sign transaction: ${(err as Error).message}`)
  }
})

test('client - get chain id', async (assert) => {
  const store = new MockStore()
  const bus = new MockEventBus()
  const client = new Client('test-dapp', store, bus)

  try {
    await client.getChainId()
    assert.fail('Client get chain id did not throw an error')
  } catch (err) {
    assert.pass(`Client get chain id: ${(err as Error).message}`)
  }
})
