import { RawInteraction } from '@vegaprotocol/wallet-ui'
import {
  WalletService,
  WalletStore,
  EventBus,
} from '@vegaprotocol/wallet-service'

const storage =
  globalThis.browser?.storage?.local || globalThis.chrome?.storage?.local
const runtime = globalThis.browser?.runtime || globalThis.chrome?.runtime

runtime.onConnect.addListener((portal) => {
  new WalletService({
    store: new WalletStore(storage),
    eventBus: new EventBus({
      sendMessage: (message: RawInteraction) => portal.postMessage(message),
      addListener: (handler) => portal.onMessage.addListener(handler),
    }),
  })
})
