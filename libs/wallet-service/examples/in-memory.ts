import { INTERACTION_TYPE, InteractionResponse } from '@vegaprotocol/wallet-ui/src/types'
import { WalletService } from '../src'
import { WalletStore } from '../src/storage'
import { EventBus } from '../src/events'

const ws = new WalletService({
  store: new WalletStore(browser.storage.local),
})

ws.handleAdmin('admin.create_network', {
  config: {
    name: 't1',
    api: {
      restConfig: {
        hosts: ['localhost'],
      },
    },
  },
})

browser.runtime.onConnect.addListener((portal) => {
  ws.onConnect({
    sender: portal.sender?.url ?? '',
    eventBus: new EventBus({
      sendMessage: message => portal.postMessage(message),
      addListener: handler => {
        portal.onMessage.addListener((message: object) => {
          if ('traceID' in message && 'name' in message) {
            handler(message as InteractionResponse)
          }
        })
      },
    }),
  })

  ws.handleClient(
    INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW,
    {
      hostname: portal.sender?.url
    }
  )
})
