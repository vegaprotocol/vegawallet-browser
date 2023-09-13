const testnet = {
  network: {
    name: 'Fairground',
    rest: ['https://api.n06.testnet.vega.xyz', 'https://api.n07.testnet.vega.xyz'],
    console: 'https://console.fairground.wtf',
    explorer: 'https://explorer.fairground.wtf',
    governance: 'https://governance.fairground.wtf',
    vegaDapps: 'https://vega.xyz/use',
    docs: 'https://docs.vega.xyz/testnet'
  },
  feedbackLink: 'https://github.com/vegaprotocol/feedback/discussions',
  encryptionSettings: undefined,
  closeWindowOnPopupOpen: true,
  userDataPolicy: 'https://vega.xyz/vega-wallet-user-data-policy/',
  sentryDsn: 'https://7f7577b2eefe43a58dc25d2eda9b1a74@o286262.ingest.sentry.io/4505199579758592',
  logging: false,
  showDisclaimer: false,

  manifestReplacements: {
    buildName: 'Fairground',
    geckoId: 'browser-extension@vega.xyz',
    iconPrefix: 'Fairground'
  },
  autoOpenOnInstall: true
}

export default testnet
