import { WalletService, WalletStore } from '../src'

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
