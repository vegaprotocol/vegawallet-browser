import testnet from './testnet'

const dev = {
  ...testnet,
  logging: true,
  sentryDsn: undefined
}

export default dev
