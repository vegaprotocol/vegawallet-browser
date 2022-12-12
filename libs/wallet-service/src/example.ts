import { WalletService } from './index.js'
import { NetworkConfig, Networks } from './services/networks.js'
import LSMap from './storage/localstorage.js'

import { Storage } from './storage/types/storage.js'

const ws = new WalletService({
  networks: new Networks(new LSMap('networks') as Storage<NetworkConfig>),
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
