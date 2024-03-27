import { render, screen } from '@testing-library/react'

import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'
import { useConnectionStore } from '@/stores/connections'
import { useNetworksStore } from '@/stores/networks-store'
import { useTabStore } from '@/stores/tab-store'
import { mockStore } from '@/test-helpers/mock-store'

import { testingNetwork } from '../../../config/well-known-networks'
import { locators, NetworkIndicator } from './network-indicator'

jest.mock('@/stores/tab-store')
jest.mock('@/stores/networks-store')
jest.mock('@/stores/connections')

const renderComponent = () => {
  return render(
    <MockNetworkProvider>
      <NetworkIndicator />
    </MockNetworkProvider>
  )
}

describe('NetworkIndicator', () => {
  it('should render nothing while connections are loading', () => {
    mockStore(useNetworksStore, {
      networks: []
    })
    mockStore(useTabStore, {
      currentTab: null
    })
    mockStore(useConnectionStore, {
      loading: true
    })
    const view = renderComponent()
    expect(view.container).toBeEmptyDOMElement()
  })
  it('should render neutral indicator if there are no connections present', () => {
    mockStore(useNetworksStore, {
      networks: []
    })
    mockStore(useTabStore, {
      currentTab: null
    })
    mockStore(useConnectionStore, {
      connections: []
    })
    renderComponent()
    expect(screen.getByTestId(locators.indicator)).toHaveClass('bg-black')
  })

  it('should neutral indicator if the current site is not connected', () => {
    mockStore(useNetworksStore, {
      networks: []
    })
    mockStore(useTabStore, {
      currentTab: { url: 'http://www.foo.com' }
    })
    mockStore(useConnectionStore, {
      connections: [{}]
    })
    renderComponent()
    expect(screen.getByTestId(locators.indicator)).toHaveClass('bg-black')
  })

  it('should success indicator if the current site is connected and on the same chainId', () => {
    mockStore(useNetworksStore, {
      networks: []
    })
    mockStore(useTabStore, {
      currentTab: {
        url: 'http://www.foo.com'
      }
    })
    mockStore(useConnectionStore, {
      connections: [
        {
          origin: 'http://www.foo.com',
          chainId: testingNetwork.chainId
        }
      ]
    })
    renderComponent()
    expect(screen.getByTestId(locators.indicator)).toHaveClass('bg-vega-green-550')
  })

  it('should render warning indicator if the current site is connected and not on the same chainId', () => {
    mockStore(useNetworksStore, {
      networks: [
        {
          id: testingNetwork.id,
          name: 'Testing network'
        },
        {
          id: 'networkId',
          name: 'Testing network2'
        }
      ]
    })
    mockStore(useTabStore, {
      currentTab: {
        url: 'http://www.foo.com'
      }
    })
    mockStore(useConnectionStore, {
      connections: [
        {
          origin: 'http://www.foo.com',
          chainId: 'chainId',
          networkId: 'networkId'
        }
      ]
    })
    renderComponent()
    expect(screen.getByTestId(locators.indicator)).toHaveClass('bg-warning')
  })
})
