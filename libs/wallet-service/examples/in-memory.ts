import { WalletService } from '../src'
import { WalletStore } from '../src/storage'
import { EventBus } from '../src/events'

const ws = new WalletService({
  store: new WalletStore(browser.storage.local),
})

browser.runtime.onConnect.addListener((portal) => {
  ws.onConnect({
    eventBus: new EventBus({
      sendMessage: (message: any) => portal.postMessage(message),
      addListener: (handler) => portal.onMessage.addListener(handler),
    }),
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
})
