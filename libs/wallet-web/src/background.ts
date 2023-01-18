import { RawInteraction, InteractionResponse } from '@vegaprotocol/wallet-ui'
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

runtime.onConnect.addListener((portal) => {
  service.onConnect({
    eventBus: new EventBus({
      sendMessage: (message: RawInteraction) => portal.postMessage(message),
      addListener: (handler) =>
        portal.onMessage.addListener((message) => {
          if ('traceID' in message && 'name' in message) {
            handler(message as InteractionResponse)
          }
        }),
    }),
  })
})
