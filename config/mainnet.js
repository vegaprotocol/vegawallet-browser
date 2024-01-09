import * as networks from './well-known-networks.js'
const mainnet = {
  title: 'Vega Wallet - Mainnet',
  defaultNetworkId: networks.mainnet.id,
  defaultChainId: networks.mainnet.chainId,
  networks: [networks.mainnet, networks.fairground],
  feedbackLink: 'https://github.com/vegaprotocol/feedback/discussions',
  encryptionSettings: undefined,
  closeWindowOnPopupOpen: true,
  sentryDsn: 'https://7f7577b2eefe43a58dc25d2eda9b1a74@o286262.ingest.sentry.io/4505199579758592',
  userDataPolicy: 'https://vega.xyz/vega-wallet-user-data-policy/',
  logging: false,
  showDisclaimer: true,
  manifestReplacements: {
    buildName: 'Mainnet',
    geckoId: 'browser-extension-mainnet@vega.xyz',
    iconPrefix: 'Mainnet'
  },
  features: {
    popoutHeader: true
  },
  autoOpenOnInstall: true
}

export default mainnet
