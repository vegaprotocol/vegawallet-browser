const testnet = {
  title: 'Vega Wallet - Fairground',
  network: {
    name: 'Fairground',
    rest: [
      'https://api.n00.testnet.vega.rocks',
      'https://api.n06.testnet.vega.rocks',
      'https://api.n07.testnet.vega.rocks',
      'https://api.n08.testnet.vega.rocks',
      'https://api.n09.testnet.vega.rocks'
    ],
    console: 'https://console.fairground.wtf',
    explorer: 'https://explorer.fairground.wtf',
    governance: 'https://governance.fairground.wtf',
    docs: 'https://docs.vega.xyz/testnet',
    deposit: 'https://console.fairground.wtf/#/portfolio/assets/deposit',
    transfer: 'https://console.fairground.wtf/#/portfolio/assets/transfer',
    withdraw: 'https://console.fairground.wtf/#/portfolio/assets/withdraw'
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
