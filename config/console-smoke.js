import testnet from "./testnet.js"

const smokeConsole = testnet

smokeConsole.network.console = 'http://localhost:3000'
smokeConsole.manifestReplacements.buildName = 'Test'

export default smokeConsole
