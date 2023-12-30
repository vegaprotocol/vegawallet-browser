import * as networks from './well-known-networks.js'

const testnet = {
  title: 'Vega Wallet - Fairground',
  defaultNetworkId: networks.fairground.id,
  defaultChainId: networks.fairground.chainId,
  network: [
    networks.mainnet,
    networks.fairground
  ],
  feedbackLink: 'https://github.com/vegaprotocol/feedback/discussions',
  encryptionSettings: undefined,
  closeWindowOnPopupOpen: true,
  userDataPolicy: 'https://vega.xyz/vega-wallet-user-data-policy/',
  sentryDsn: 'https://7f7577b2eefe43a58dc25d2eda9b1a74@o286262.ingest.sentry.io/4505199579758592',
  logging: false,
  showDisclaimer: false,
  features: {
    popoutHeader: true
  },
  manifestReplacements: {
    buildName: 'Fairground',
    geckoId: 'browser-extension@vega.xyz',
    iconPrefix: 'Fairground'
  },
  autoOpenOnInstall: true
}

export default testnet
