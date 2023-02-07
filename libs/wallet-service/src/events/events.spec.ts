import test from 'tape'
import { EventEmitter } from 'eventemitter3'
import type {
  InteractionType,
  InteractionResponseType,
  InteractionResponse,
  RawInteraction,
} from '@vegaprotocol/wallet-ui'

import {
  EventDataMap,
  EventResponseDataMap,
  traceID,
} from '../../test/mock-events'
import { EventBus, ResponseMapping } from './'

const TEST_CASES: [InteractionType, InteractionResponseType | null][] = [
  ['ERROR_OCCURRED', ResponseMapping['ERROR_OCCURRED']],
  ['INTERACTION_SESSION_BEGAN', ResponseMapping['INTERACTION_SESSION_BEGAN']],
  ['INTERACTION_SESSION_ENDED', ResponseMapping['INTERACTION_SESSION_ENDED']],
  ['LOG', ResponseMapping['LOG']],
  ['REQUEST_PASSPHRASE', ResponseMapping['REQUEST_PASSPHRASE']],
  ['REQUEST_PERMISSIONS_REVIEW', ResponseMapping['REQUEST_PERMISSIONS_REVIEW']],
  ['REQUEST_SUCCEEDED', ResponseMapping['REQUEST_SUCCEEDED']],
  [
    'REQUEST_TRANSACTION_REVIEW_FOR_SENDING',
    ResponseMapping['REQUEST_TRANSACTION_REVIEW_FOR_SENDING'],
  ],
  [
    'REQUEST_WALLET_CONNECTION_REVIEW',
    ResponseMapping['REQUEST_WALLET_CONNECTION_REVIEW'],
  ],
  ['REQUEST_WALLET_SELECTION', ResponseMapping['REQUEST_WALLET_SELECTION']],
]

const getImplementation = (
  emitter: EventEmitter,
  sentEvents: RawInteraction[]
) => ({
  sendMessage: (event: RawInteraction) => {
    sentEvents.push(event)
  },
  addListener: (handler: (message: InteractionResponse) => void) => {
    emitter.addListener('event', (message: InteractionResponse) =>
      handler(message)
    )
  },
})

const waitForClient = async (
  bus: EventBus,
  emitter: EventEmitter,
  event: RawInteraction,
  response?: InteractionResponse | null
) => {
  return Promise.all([
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Doesn't understand dynamic assignments here
    bus.emit(event),
    // Emulate the correct user response for interactions which need one
    new Promise((resolve) =>
      setTimeout(() => {
        if (response) {
          emitter.emit('event', {
            traceID,
            name: response.name,
            data: 'data' in response ? response.data : null,
          })
        }

        resolve(null)
      })
    ),
  ])
}

TEST_CASES.forEach(([event, responseEvent]) => {
  test(`events - emitting ${event} resolves the correct response`, async (assert) => {
    const events = new EventEmitter()
    const eventToSend = EventDataMap[event]
    const eventToReceive = responseEvent
      ? EventResponseDataMap[responseEvent]
      : null

    const sentEvents: RawInteraction[] = []
    const implementation = getImplementation(events, sentEvents)

    const bus = new EventBus(implementation)

    const [res] = await waitForClient(bus, events, eventToSend, eventToReceive)

    assert.equals(sentEvents.length, 1, 'Sent one event to the wallet ui')

    if (responseEvent) {
      assert.deepEqual(res, eventToReceive, 'Received the correct response')
    } else {
      assert.equal(res, null)
    }
  })
})

test.skip('events - user cancellation', async (assert) => {
  const event = 'REQUEST_WALLET_CONNECTION_REVIEW'
  const events = new EventEmitter()
  const eventToSend = EventDataMap[event]

  const sentEvents: RawInteraction[] = []
  const implementation = getImplementation(events, sentEvents)

  const bus = new EventBus(implementation)

  try {
    await waitForClient(bus, events, eventToSend)
    assert.fail('Expected to throw a cancellation error')
  } catch (err: unknown) {
    assert.match((err as Error).message, /Cancelled by the user/)
    assert.pass('Cancels the event and throws a cancellation error')
  }

  assert.equals(sentEvents.length, 2, 'Sent two events to the wallet ui')
  assert.deepEqual(sentEvents[0], eventToSend, 'Sends the connection request')
  assert.deepEqual(
    sentEvents[1],
    {
      traceID,
      name: 'INTERACTION_SESSION_ENDED',
    },
    'Sends an interaction end event'
  )
})

test.skip('events - incorrect response', async (assert) => {
  const event = 'REQUEST_WALLET_CONNECTION_REVIEW'
  const events = new EventEmitter()
  const eventToSend = EventDataMap[event]

  const sentEvents: RawInteraction[] = []
  const implementation = getImplementation(events, sentEvents)

  const bus = new EventBus(implementation)

  try {
    await waitForClient(bus, events, eventToSend)
    assert.fail('Expected to throw a cancellation error')
    return
  } catch (err: unknown) {
    assert.match(
      (err as Error).message,
      /Incorrect response to interaction event/
    )
    assert.pass('Cancels the event and throws a cancellation error')
  }

  assert.equals(sentEvents.length, 3, 'Sent three events to the wallet ui')
  assert.deepEqual(sentEvents[0], eventToSend, 'Sends the connection request')
  assert.deepEqual(
    sentEvents[1],
    {
      traceID,
      name: 'ERROR_OCCURRED',
      data: {
        name: 'Error',
        error: 'Unexpected response type',
      },
    },
    'Sends the error event'
  )
  assert.deepEqual(
    sentEvents[2],
    {
      traceID,
      name: 'INTERACTION_SESSION_ENDED',
    },
    'Sends the interaction end event'
  )
})
