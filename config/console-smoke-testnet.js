import testnet from './testnet.js'
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const smokeConsoleTestnet = cloneDeep(testnet)
const overrides = {
  manifestReplacements: {
    buildName: 'Test'
  },
  autoOpenOnInstall: false
}

smokeConsoleTestnet.networks.find((n) => n.id === 'fairground').console = 'http://localhost:3000'

merge(smokeConsoleTestnet, overrides)
export default smokeConsoleTestnet
