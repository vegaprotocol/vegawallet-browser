import test from 'tape'
import { EventEmitter } from 'events'
import {
  InteractionResponse,
  INTERACTION_TYPE,
  INTERACTION_RESPONSE_TYPE,
  CONNECTION_RESPONSE,
  PermissionTarget,
  PermissionType,
} from '@vegaprotocol/wallet-ui'
import { EventBus, ResponseMapping } from './'
import type { EventData, EventResponseData } from './'

const EventDataMap: Record<INTERACTION_TYPE, EventData | null> = {
  [INTERACTION_TYPE.INTERACTION_SESSION_BEGAN]: null,
  [INTERACTION_TYPE.INTERACTION_SESSION_ENDED]: null,
  [INTERACTION_TYPE.LOG]: {
    type: 'Info',
    message: 'What a sunny day!',
  },
  [INTERACTION_TYPE.ERROR_OCCURRED]: {
    name: 'Error',
    message: 'Oh no, this happened!',
  },
  [INTERACTION_TYPE.REQUEST_SUCCEEDED]: {
    message: 'Success!',
  },
  [INTERACTION_TYPE.REQUEST_TRANSACTION_REVIEW_FOR_SENDING]: {
    hostname: 'http://example.com',
    wallet: 'wallet-1',
    publicKey: '0x1',
    transaction: '<TRANSACTION_CONTENT>',
    receivedAt: new Date('2023/01/01').toISOString(),
  },
  [INTERACTION_TYPE.TRANSACTION_SUCCEEDED]: {
    txHash: '0x0',
    tx: '<TX>',
    deserializedInputData: '<TRANSACTION_INPUT>',
    sentAt: new Date('2023/01/01').toISOString(),
  },
  [INTERACTION_TYPE.TRANSACTION_FAILED]: {
    tx: '<TX>',
    deserializedInputData: '<TRANSACTION_INPUT>',
    error: 'Transaction Error',
    sentAt: new Date('2023/01/01').toISOString(),
  },
  [INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW]: {
    hostname: 'http://example.com',
    wallet: 'wallet-1',
    permissions: {
      [PermissionTarget.PUBLIC_KEYS]: PermissionType.READ,
    },
  },
  [INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW]: {
    hostname: 'http://example.com',
  },
  [INTERACTION_TYPE.REQUEST_WALLET_SELECTION]: {
    hostname: 'http://example.com',
    availableWallets: ['wallet-1', 'wallet-2'],
  },
  [INTERACTION_TYPE.REQUEST_PASSPHRASE]: {
    wallet: 'wallet-1',
  },
}

const EventResponseDataMap: Record<
  INTERACTION_RESPONSE_TYPE,
  EventResponseData | null
> = {
  [INTERACTION_RESPONSE_TYPE.CANCEL_REQUEST]: null,
  [INTERACTION_RESPONSE_TYPE.DECISION]: {
    approved: true,
  },
  [INTERACTION_RESPONSE_TYPE.ENTERED_PASSPHRASE]: {
    passphrase: 'xyz',
  },
  [INTERACTION_RESPONSE_TYPE.SELECTED_WALLET]: {
    wallet: 'test',
    passphrase: 'xyz',
  },
  [INTERACTION_RESPONSE_TYPE.WALLET_CONNECTION_DECISION]: {
    connectionApproval: CONNECTION_RESPONSE.APPROVED_ONCE,
  },
}

const getImplementation = (events: EventEmitter) => ({
  sendMessage: jest.fn(),
  addListener: (handler: (message: InteractionResponse) => void) => {
    events.addListener('event', (message: InteractionResponse) =>
      handler(message)
    )
  },
})

const traceID = '1'

const TEST_CASES: [INTERACTION_TYPE, INTERACTION_RESPONSE_TYPE | null][] = [
  [
    INTERACTION_TYPE.ERROR_OCCURRED,
    ResponseMapping[INTERACTION_TYPE.ERROR_OCCURRED],
  ],
  [
    INTERACTION_TYPE.INTERACTION_SESSION_BEGAN,
    ResponseMapping[INTERACTION_TYPE.INTERACTION_SESSION_BEGAN],
  ],
  [
    INTERACTION_TYPE.INTERACTION_SESSION_ENDED,
    ResponseMapping[INTERACTION_TYPE.INTERACTION_SESSION_ENDED],
  ],
  [INTERACTION_TYPE.LOG, ResponseMapping[INTERACTION_TYPE.LOG]],
  [
    INTERACTION_TYPE.REQUEST_PASSPHRASE,
    ResponseMapping[INTERACTION_TYPE.REQUEST_PASSPHRASE],
  ],
  [
    INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW,
    ResponseMapping[INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW],
  ],
  [
    INTERACTION_TYPE.REQUEST_SUCCEEDED,
    ResponseMapping[INTERACTION_TYPE.REQUEST_SUCCEEDED],
  ],
  [
    INTERACTION_TYPE.REQUEST_TRANSACTION_REVIEW_FOR_SENDING,
    ResponseMapping[INTERACTION_TYPE.REQUEST_TRANSACTION_REVIEW_FOR_SENDING],
  ],
  [
    INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW,
    ResponseMapping[INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW],
  ],
  [
    INTERACTION_TYPE.REQUEST_WALLET_SELECTION,
    ResponseMapping[INTERACTION_TYPE.REQUEST_WALLET_SELECTION],
  ],
]

TEST_CASES.forEach(([event, responseEvent]) => {
  test(`events - emitting ${event} resolves the correct response`, async (assert) => {
    assert.plan(4)
    const TRACE_ID = '1'
    const events = new EventEmitter()
    const eventData = EventDataMap[event]
    const responseData = responseEvent
      ? EventResponseDataMap[responseEvent]
      : null

    const implementation = getImplementation(events)

    const bus = new EventBus(implementation)

    const [res] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Dynamic arguments confuste typescript
      bus.emit(event, eventData),
      // Emulate the correct user response for interactions which need one
      new Promise((resolve) =>
        setTimeout(() => {
          if (responseEvent) {
            events.emit('event', {
              traceID: TRACE_ID,
              name: responseEvent,
              data: responseData,
            })
          }

          resolve(null)
        })
      ),
    ])

    if (responseEvent) {
      assert.deepEqual(res, {
        traceID: TRACE_ID,
        name: responseEvent,
        data: responseData,
      })
    } else {
      assert.equal(res, null)
    }

    assert.end()
  })
})

test('the event flow gets aborted', async () => {
  const event = INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW
  const events = new EventEmitter()
  const eventData = EventDataMap[event]

  const implementation = getImplementation(events)

  const bus = new EventBus(implementation)

  const main = () =>
    Promise.all([
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Dynamic arguments confuste typescript
      bus.emit(event, eventData),
      // Emulate a cancel event emission by the user
      new Promise((resolve) =>
        setTimeout(() => {
          events.emit('event', {
            traceID,
            name: INTERACTION_RESPONSE_TYPE.CANCEL_REQUEST,
          })
          resolve(null)
        })
      ),
    ])

  await expect(main()).rejects.toThrow(/Cancelled by the user/)
  expect(implementation.sendMessage).toHaveBeenCalledTimes(2)
  expect(implementation.sendMessage).toHaveBeenCalledWith({
    traceID,
    name: event,
    data: eventData,
  })
  expect(implementation.sendMessage).toHaveBeenCalledWith({
    traceID,
    name: INTERACTION_TYPE.INTERACTION_SESSION_ENDED,
  })
})

test('the event flow gets aborted with an error', async () => {
  const event = INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW
  const events = new EventEmitter()
  const eventData = EventDataMap[event]

  const implementation = getImplementation(events)

  const bus = new EventBus(implementation)

  const main = () =>
    Promise.all([
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Dynamic arguments confuste typescript
      bus.emit(event, eventData),
      // Emulate an incorrect user response
      new Promise((resolve) =>
        setTimeout(() => {
          events.emit('event', {
            traceID,
            name: 'INVALID_INTERACTION_RESPONSE_TYPE',
          })
          resolve(null)
        })
      ),
    ])

  await expect(main()).rejects.toThrow(
    /Incorrect response to interaction event/
  )
  expect(implementation.sendMessage).toHaveBeenCalledTimes(3)
  expect(implementation.sendMessage).toHaveBeenCalledWith({
    traceID,
    name: event,
    data: eventData,
  })
  expect(implementation.sendMessage).toHaveBeenCalledWith({
    traceID,
    name: INTERACTION_TYPE.ERROR_OCCURRED,
    data: {
      name: 'Error',
      error: 'Unexpected response type',
    },
  })
  expect(implementation.sendMessage).toHaveBeenCalledWith({
    traceID,
    name: INTERACTION_TYPE.INTERACTION_SESSION_ENDED,
  })
})
