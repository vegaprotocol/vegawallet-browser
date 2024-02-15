import testnet from './beta.js'

const dev = {
  ...testnet,
  logging: true,
  sentryDsn: undefined,
  autoOpenOnInstall: true
}

export default dev
