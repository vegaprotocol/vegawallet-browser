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

smokeConsoleMainnet.networks.find(n => n.id === 'mainnet').console = 'http://localhost:3001'

merge(smokeConsoleMainnet, overrides)
export default smokeConsoleMainnet
