import testnet from './testnet.js'

const dev = {
  ...testnet,
  logging: true,
  sentryDsn: undefined
}

export default dev
