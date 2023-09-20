import mainnet from "./mainnet.js"
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const smokeConsoleMainnet = cloneDeep(mainnet)
let overrides = {
   network: {
      console: 'http://localhost:3001'
   },
   manifestReplacements: {
      buildName: 'Test'
   },
   autoOpenOnInstall: false
}

merge(smokeConsoleMainnet, overrides)
export default smokeConsoleMainnet
