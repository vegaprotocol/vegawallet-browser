import testnet from "./testnet.js"
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const smokeConsoleTestnet = cloneDeep(testnet)
let overrides = {
   network: {
      console: 'http://localhost:3000'
   },
   manifestReplacements: {
      buildName: 'Test'
   },
   autoOpenOnInstall: false
}

merge(smokeConsoleTestnet, overrides)
export default smokeConsoleTestnet
