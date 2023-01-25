import { RawInteraction, InteractionResponse } from '@vegaprotocol/wallet-ui/src/types'
import {
  WalletService,
  WalletStore,
  EventBus,
} from '@vegaprotocol/wallet-service'

const storage =
  globalThis.browser?.storage?.local || globalThis.chrome?.storage?.local
const runtime = globalThis.browser?.runtime || globalThis.chrome?.runtime

const service = new WalletService({
  store: new WalletStore(storage),
})

runtime.onConnect.addListener(portal => {
  if (portal.sender?.url) {
    service.onConnect({
      sender: portal.sender.url,
      eventBus: new EventBus({
        sendMessage: (message: RawInteraction) => portal.postMessage(message),
        addListener: (handler: (message: InteractionResponse) => void) =>
          portal.onMessage.addListener((message: object) => {
            if ('traceID' in message && 'name' in message) {
              handler(message as InteractionResponse)
            }
          }),
      }),
    })
  }
})
