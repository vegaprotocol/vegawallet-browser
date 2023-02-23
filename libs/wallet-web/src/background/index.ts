import { WalletService, WalletStore } from '@vegaprotocol/wallet-service'
import { getStorage, getRuntime } from '../util'

import { getImplementation } from './implementation'
import { messageHandler } from './handler'

const runtime = getRuntime()
const storage = getStorage()

setup()

function setup() {
  runtime.onInstalled.addListener(() => {
    console.info('Vega Wallet installed!')

    const ws = new WalletService({
      store: new WalletStore(storage),
      implementation: getImplementation(),
    })

    runtime.onMessage.addListener(messageHandler(ws))
  })
}
