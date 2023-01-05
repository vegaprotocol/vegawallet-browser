import { WalletService } from '../index.js'
import { NetworkConfig, Networks } from '../services/networks'
import LSMap from '../services/storage/ext-local'

// Use Map as storage, which will only keep state for this session
const ws = new WalletService({
  networks: new Networks(new LSMap<NetworkConfig>('networks')),
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
