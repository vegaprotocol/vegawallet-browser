import { NetworkContext } from './network-context'

/**
 * Provides a network through useNetworkProvider. If the app is in interaction mode with the network specified in the currentConnectionDetails or currentTransactionDetails then that network is provided. Otherwise the selected network is provided.
 * @param param0
 * @returns
 */
export const MockNetworkProvider = ({ children }: { children: JSX.Element }) => {
  const network = {
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
    deposit: 'https://console.fairground.wtf/#/portfolio/assets/deposit',
    transfer: 'https://console.fairground.wtf/#/portfolio/assets/transfer',
    withdraw: 'https://console.fairground.wtf/#/portfolio/assets/withdraw',
    docs: 'https://docs.vega.xyz/testnet',
    vegaDapps: 'https://vega.xyz/apps'
  }

  return <NetworkContext.Provider value={{ network }}>{children}</NetworkContext.Provider>
}
