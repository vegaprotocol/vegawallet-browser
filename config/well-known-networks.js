const mockPort = 9090

export const mainnet = {
  color: '#000000',
  secondaryColor: '#FFFFFF',
  id: 'mainnet',
  name: 'Mainnet',
  chainId: 'vega-mainnet-0011',
  hidden: false,
  rest: [
    'https://vega-mainnet-data.commodum.io',
    'https://vega-data.nodes.guru:3008',
    'https://vega-data.bharvest.io',
    'https://datanode.vega.pathrocknetwork.org',
    'https://vega.aurora-edge.com',
    'https://darling.network',
    'https://rest.velvet.tm.p2p.org',
    'https://vega-rest.mainnet.lovali.xyz',
    'https://graphqlvega.gpvalidator.com',
    'https://vega-mainnet.anyvalid.com',
    'https://vega.mainnet.stakingcabin.com:3008'
  ],
  console: 'https://console.vega.xyz',
  ethereumExplorerLink: 'https://etherscan.io',
  explorer: 'https://explorer.vega.xyz',
  governance: 'https://governance.vega.xyz',
  docs: 'https://docs.vega.xyz/mainnet/concepts/new-to-vega',
  vegaDapps: 'https://vega.xyz/apps'
}

export const fairground = {
  color: '#D7FB50',
  secondaryColor: '#000000',
  id: 'fairground',
  name: 'Fairground',
  chainId: 'vega-fairground-202305051805',
  hidden: false,
  rest: [
    'https://api.n00.testnet.vega.rocks',
    'https://api.n06.testnet.vega.rocks',
    'https://api.n07.testnet.vega.rocks',
    'https://api.n08.testnet.vega.rocks',
    'https://api.n09.testnet.vega.rocks'
  ],
  console: 'https://console.fairground.wtf',
  ethereumExplorerLink: 'https://sepolia.etherscan.io',
  explorer: 'https://explorer.fairground.wtf',
  governance: 'https://governance.fairground.wtf',
  docs: 'https://docs.vega.xyz/testnet/concepts/new-to-vega',
  vegaDapps: 'https://vega.xyz/apps'
}

export const testingNetwork = {
  ...fairground,
  id: 'test',
  name: 'Test',
  chainId: 'test-chain-id',
  rest: [`http://localhost:${mockPort}`]
}

export const testingNetwork2 = {
  ...testingNetwork,
  explorer: 'https://different-explorer.vega.xyz',
  id: 'test2',
  name: 'Test 2',
  chainId: 'test-chain-id-2'
}
