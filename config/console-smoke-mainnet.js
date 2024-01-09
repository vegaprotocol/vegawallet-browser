import mainnet from './mainnet.js'
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const smokeConsoleMainnet = cloneDeep(mainnet)
const overrides = {
  manifestReplacements: {
    buildName: 'Test'
  },
  autoOpenOnInstall: false
}

export const consolePath = 'http://localhost:3001'

smokeConsoleMainnet.networks.find((n) => n.id === 'mainnet').console = consolePath

merge(smokeConsoleMainnet, overrides)
export default smokeConsoleMainnet
