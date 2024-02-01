import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'
import { useGlobalsStore } from '@/stores/globals'
import { useNetworksStore } from '@/stores/networks-store'
import { mockStore } from '@/test-helpers/mock-store'

import { fairground, testingNetwork } from '../../../config/well-known-networks'
import { NetworkListProperties } from '../networks-list'
import { locators, NetworkSwitcher } from './network-switcher'

jest.mock('@/stores/globals')
jest.mock('@/stores/networks-store')

jest.mock('@/contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: jest.fn()
}))

jest.mock('../networks-list', () => ({
  NetworksList: (properties: NetworkListProperties) => (
    <button onClick={() => properties.onClick?.(properties.networks[0])} data-testid="networks-list">
      Click
    </button>
  )
}))

const renderComponent = () => {
  return render(
    <MockNetworkProvider>
      <NetworkSwitcher />
    </MockNetworkProvider>
  )
}

const mockStores = () => {
  const loadGlobals = jest.fn()
  const setSelectedNetwork = jest.fn()
  mockStore(useGlobalsStore, { loadGlobals: loadGlobals })
  mockStore(useNetworksStore, {
    networks: [testingNetwork, fairground],
    selectedNetwork: testingNetwork,
    setSelectedNetwork: setSelectedNetwork
  })
  return {
    loadGlobals,
    setSelectedNetwork
  }
}

describe('NetworkSwitcher', () => {
  it('renders message explaining network selector and networks list', async () => {
    mockStores()
    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    renderComponent()
    fireEvent.click(screen.getByTestId(locators.networkSwitcherCurrentNetwork))
    await screen.findByTestId('networks-list')
    expect(screen.getByTestId(locators.networkSwitcherMessage)).toHaveTextContent(
      'Your selected network is for display purposes only, you can connect and place transactions on any configured network regardless of what network you have selected.'
    )
    expect(screen.getByTestId('networks-list')).toBeInTheDocument()
  })

  it('sets selected network and reloads the globals on network change', async () => {
    const { setSelectedNetwork, loadGlobals } = mockStores()
    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    renderComponent()
    fireEvent.click(screen.getByTestId(locators.networkSwitcherCurrentNetwork))
    await screen.findByTestId('networks-list')
    fireEvent.click(screen.getByTestId('networks-list'))
    await waitFor(() => expect(loadGlobals).toHaveBeenCalledTimes(1))
    expect(setSelectedNetwork).toHaveBeenCalledTimes(1)
  })
})
