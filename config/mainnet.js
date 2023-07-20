const mainnet = {
  network: {
    name: 'Mainnet',
    rest: [
      'https://vega-mainnet-data.commodum.io',
      'https://vega-data.nodes.guru:3008',
      'https://vega-data.bharvest.io',
      'https://datanode.vega.pathrocknetwork.org',
      'https://vega.aurora-edge.com',
      'https://darling.network'
    ],
    console: 'https://console.vega.xyz',
    ethereumExplorerLink: 'https://etherscan.io',
    explorer: 'https://explorer.vega.xyz',
    governance: 'https://governance.vega.xyz',
    vegaDapps: 'https://vega.xyz/use'
  },
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
  }
}

export default mainnet
