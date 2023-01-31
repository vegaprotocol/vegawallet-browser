import test from 'tape'
import { Interactor } from './interactor'
import { MockStore } from '../../test/mock-storage'
import { MockEventBus } from '../../test/mock-events'

const getTraceID = () => '1'

test('interactor - connect', async (assert) => {
  const store = new MockStore()
  const bus = new MockEventBus()
  new Interactor({ bus, store, getTraceID })

  assert.pass()
})
