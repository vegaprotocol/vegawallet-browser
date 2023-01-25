import { WalletService } from '../index.js'
import { Keys } from '../services/keys.js'
import { Networks } from '../services/networks'
import { Wallets } from '../services/wallets.js'

const walletStorage = new Map()

// Use Map as storage, which will only keep state for this session
const ws = new WalletService({
  networks: new Networks(new Map()),
  wallets: new Wallets(walletStorage),
  keys: new Keys(walletStorage),
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
