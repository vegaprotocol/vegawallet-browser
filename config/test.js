const mockPort = 9090
const mockChainId = 'testnet'

const test = {
  title: 'Vega Wallet - Test',
  defaultNetworkId: 'test',
  defaultChainId: mockChainId,
  test: {
    mockPort
  },
  networks: [testingNetwork],
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
