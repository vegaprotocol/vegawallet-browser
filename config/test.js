const mockPort = 9090

const test = {
  title: 'Vega Wallet - Test',
  test: {
    mockPort
  },
  network: {
    name: 'Test',
    rest: [`http://localhost:${mockPort}`],
    console: 'https://console.fairground.wtf',
    ethereumExplorerLink: 'https://sepolia.etherscan.io',
    explorer: 'https://explorer.fairground.wtf',
    governance: 'https://governance.fairground.wtf',
    deposit: 'https://console.fairground.wtf/#/portfolio/assets/deposit',
    transfer: 'https://console.fairground.wtf/#/portfolio/assets/transfer',
    withdraw: 'https://console.fairground.wtf/#/portfolio/assets/withdraw',
    docs: 'https://docs.vega.xyz/testnet'
  },
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
