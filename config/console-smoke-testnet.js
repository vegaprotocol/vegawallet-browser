import testnet from './beta.js'
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const smokeConsoleTestnet = cloneDeep(testnet)
const overrides = {
  manifestReplacements: {
    buildName: 'Test'
  },
  autoOpenOnInstall: false
}

export const consolePath = 'http://localhost:3000'

smokeConsoleTestnet.networks.find((n) => n.id === 'fairground').console = consolePath

merge(smokeConsoleTestnet, overrides)

export default smokeConsoleTestnet
