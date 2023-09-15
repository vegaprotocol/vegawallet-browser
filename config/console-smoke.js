import testnet from './testnet.js'
import { cloneDeep } from 'lodash'

const smokeConsole = cloneDeep(testnet)

smokeConsole.network.console = 'http://localhost:3000'
smokeConsole.manifestReplacements.buildName = 'Test'
smokeConsole.autoOpenOnInstall = false

export default smokeConsole
