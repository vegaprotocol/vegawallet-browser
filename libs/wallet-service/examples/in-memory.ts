import { WalletService } from '../index.js'
import { NetworkConfig } from '../services/networks'
import LSMap from '../services/storage'

// Use Map as storage, which will only keep state for this session
const ws = new WalletService({
  store: {
    networks: new LSMap<NetworkConfig>('networks'),
  },
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
