import {
  RawInteraction,
  InteractionResponse,
  INTERACTION_TYPE,
} from '@vegaprotocol/wallet-ui'
import { EventBus } from './'

const getImplementationMock = (events: InteractionResponse[]) => ({
  sendMessage: jest.fn(),
  addListener: (handler: (message: InteractionResponse) => void) => {
    events.forEach((event) => handler(event))
  },
})

describe('Events', () => {
  test('', async () => {
    const implementation = getImplementationMock([])

    const bus = new EventBus(implementation)

    const res = await bus.emit(INTERACTION_TYPE.INTERACTION_SESSION_BEGAN)

    expect(res).toBe(null)
  })
})
