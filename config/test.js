const mockPort = 9090

const test = {
  test: {
    mockPort
  },
  network: {
    name: 'Test',
    rest: [`http://localhost:${mockPort}`],
    console: 'https://console.fairground.wtf',
    explorer: 'https://explorer.fairground.wtf',
    governance: 'https://governance.fairground.wtf',
    vegaDapps: 'https://vega.xyz/use'
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
  }
}

export default test
