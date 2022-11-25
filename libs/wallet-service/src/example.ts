import FSMap from './fs-map.js'
import { WalletService } from './index.js'

const ws = new WalletService({
  onerror(err) {
    console.error(err)
  },
  walletStore: new FSMap('wallets'),
  networkStore: new FSMap('networks'),
  permissionsStore: new FSMap('permissions')
})

ws.adminCreateNetwork({
  name: 't1',
  config: {
    name: 't1',
    api: {
      restConfig: {
        hosts: [
          'localhost'
        ]
      }
    }
  }
})
