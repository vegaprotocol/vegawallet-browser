import test from 'tape'
import { Interactor } from './interactor'
import { MockStore } from '../../test/mock-storage'
import {
  MockEventBus,
  EventToResponseMapping,
  EventResponseDataMap,
  traceID,
} from '../../test/mock-events'

const getTraceID = () => traceID

test('interactor - connect wallet 2', async (assert) => {
  const store = new MockStore()
  const bus = new MockEventBus()
  const interactor = new Interactor({ bus, store, getTraceID })

  const { approvedForWallet } = await interactor.connectWallet({
    origin: 'test-dapp',
    wallets: ['test', 'test2', 'test3'],
  })

  // by default the mock event bus selects a wallet named 'test' (MockEventBus.ts:220)
  assert.equal(
    approvedForWallet,
    'test',
    'The client apporved the connection and selected the correct wallet'
  )
})

test('interactor - connect wallet rejection', async (assert) => {
  const store = new MockStore()
  const bus = new MockEventBus({
    responseToData: {
      ...EventResponseDataMap,
      WALLET_CONNECTION_DECISION: {
        traceID,
        name: 'WALLET_CONNECTION_DECISION',
        data: {
          connectionApproval: 'REJECTED_ONLY_THIS_TIME',
        },
      },
    },
  })
  const interactor = new Interactor({ bus, store, getTraceID })

  try {
    await interactor.connectWallet({
      origin: 'test-dapp',
      wallets: ['test', 'test2', 'test3'],
    })
    assert.fail('Event was not interrupted when rejecting the connection')
  } catch (err) {
    assert.match(
      (err as Error).message,
      /User rejected the connection request from test-dapp/
    )
    assert.pass('Gets cancelled when the user rejects the connection attempt')
  }
})

test('interactor - review transaction', async (assert) => {
  const store = new MockStore()
  const bus = new MockEventBus()
  new Interactor({ bus, store, getTraceID })

  // @TODO: add test when implemented

  assert.pass()
})

test('interactor - request permission', async (assert) => {
  const store = new MockStore()
  const bus = new MockEventBus()
  new Interactor({ bus, store, getTraceID })

  // @TODO: add test when implemented

  assert.pass()
})
