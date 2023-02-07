import test from 'tape'
import { Interactor } from './interactor'
import { MockStore } from '../../test/mock-storage'
import { MockEventBus } from '../../test/mock-events'

const getTraceID = () => '1'

test('interactor - connect wallet', async (assert) => {
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
