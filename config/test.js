import testnet from './testnet.js'

const dev = {
  ...testnet,
  logging: true,
  sentryDsn: undefined,
  autoOpenOnInstall: true
}

export default dev
