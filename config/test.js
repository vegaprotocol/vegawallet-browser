const mockPort = 9090

const test = {
  test: {
    mockPort
  },
  network: {
    name: 'Test',
    rest: [`http://localhost:${mockPort}`],
    console: 'https://console.fairground.wtf',
    explorer: 'https://explorer.fairground.wtf'
  },
  feedbackLink: 'https://github.com/vegaprotocol/feedback/discussions',
  userDataPolicy: 'https://vega.xyz/vega-wallet-user-data-policy/',
  encryptionSettings: {
    memory: 10,
    iterations: 1
  },
  closeWindowOnPopupOpen: false,
  sentryDsn: undefined,
  logging: false
}

export default test
