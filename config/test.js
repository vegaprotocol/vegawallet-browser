import * as networks from './well-known-networks.js'

const mockPort = 9090

const test = {
  title: 'Vega Wallet - Test',
  defaultNetworkId: networks.testingNetwork.id,
  defaultChainId: networks.testingNetwork.chainId,
  test: {
    mockPort
  },
  networks: [networks.testingNetwork, networks.fairground],
  feedbackLink: 'https://github.com/vegaprotocol/feedback/discussions',
  userDataPolicy: 'https://vega.xyz/vega-wallet-user-data-policy/',
  encryptionSettings: {
    memory: 10,
    iterations: 1
  },
  closeWindowOnPopupOpen: false,
  sentryDsn: undefined,
  logging: false,
  showDisclaimer: false,

  manifestReplacements: {
    buildName: 'Test',
    geckoId: 'browser-extension-test@vega.xyz',
    iconPrefix: 'Fairground'
  },
  features: {
    popoutHeader: true
  },
  autoOpenOnInstall: false
}

export default test
