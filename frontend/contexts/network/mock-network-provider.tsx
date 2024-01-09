import { testingNetwork } from '../../../config/well-known-networks'
import { NetworkContext } from './network-context'

/**
 * Provides a network through useNetworkProvider. If the app is in interaction mode with the network specified in the currentConnectionDetails or currentTransactionDetails then that network is provided. Otherwise the selected network is provided.
 * @param param0
 * @returns
 */
export const MockNetworkProvider = ({ children }: { children: JSX.Element }) => {
  return <NetworkContext.Provider value={{ network: testingNetwork }}>{children}</NetworkContext.Provider>
}
