import { render, screen, within } from '@testing-library/react'
import { DeepPartial } from 'react-hook-form'
import { MemoryRouter } from 'react-router-dom'

import { locators as dataTableLocators } from '@/components/data-table'
import { locators as vegaSubHeaderLocators } from '@/components/sub-header'
import { locators as vegaSectionLocators } from '@/components/vega-section'
import { NetworksStore, useNetworksStore } from '@/stores/networks-store'
import { mockStore } from '@/test-helpers/mock-store'
import { silenceErrors } from '@/test-helpers/silence-errors'

import { testingNetwork } from '../../../../../../config/well-known-networks'
import { locators, NetworkDetails } from './network-details'

let useParameters: { id?: string } = { id: 'foo' }

jest.mock('@/stores/networks-store')
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => useParameters
}))

const defaultNetworkStore = {
  getNetworkById: () => ({
    ...testingNetwork
  })
}

const renderComponent = (networksStore: DeepPartial<NetworksStore> = defaultNetworkStore) => {
  mockStore(useNetworksStore, networksStore)
  return render(
    <MemoryRouter>
      <NetworkDetails />
    </MemoryRouter>
  )
}

describe('NetworkDetails', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should throw an error if id cannot be found', () => {
    silenceErrors()
    useParameters = { id: undefined }
    expect(() => renderComponent()).toThrow('Id param not provided to network details')
  })
  it('should throw an error if network cannot be found', () => {
    silenceErrors()
    useParameters = { id: 'foo' }
    expect(() => renderComponent({ getNetworkById: () => undefined })).toThrow('Could not find network with id foo')
  })
  it('should render the details of the network in each section', () => {
    renderComponent()
    const sections = screen.getAllByTestId(vegaSectionLocators.vegaSection)
    const [id, chainId, color, vegaUrls, ethereumExplorer, nodes] = sections
    expect(within(id).getByTestId(vegaSubHeaderLocators.subHeader)).toHaveTextContent('Id')
    expect(within(id).getByTestId(locators.networkId)).toHaveTextContent(testingNetwork.id)

    expect(within(chainId).getByTestId(vegaSubHeaderLocators.subHeader)).toHaveTextContent('Chain id')
    expect(within(chainId).getByTestId(locators.chainId)).toHaveTextContent(testingNetwork.chainId)

    expect(within(color).getByTestId(vegaSubHeaderLocators.subHeader)).toHaveTextContent('Color')
    expect(within(color).getByTestId(locators.color)).toHaveTextContent(testingNetwork.color)

    expect(within(vegaUrls).getByTestId(vegaSubHeaderLocators.subHeader)).toHaveTextContent('Vega URLs')
    const rows = within(vegaUrls).getAllByTestId(dataTableLocators.dataRow)
    expect(rows[0]).toHaveTextContent('Console')
    expect(rows[1]).toHaveTextContent('Governance')
    expect(rows[2]).toHaveTextContent('Explorer')
    expect(rows[3]).toHaveTextContent('Docs')
    expect(rows[0]).toHaveTextContent(testingNetwork.console)
    expect(rows[1]).toHaveTextContent(testingNetwork.governance)
    expect(rows[2]).toHaveTextContent(testingNetwork.explorer)
    expect(rows[3]).toHaveTextContent(testingNetwork.docs)

    expect(within(ethereumExplorer).getByTestId(vegaSubHeaderLocators.subHeader)).toHaveTextContent('Ethereum Explorer')
    expect(within(ethereumExplorer).getByTestId(locators.ethereumExplorer)).toHaveTextContent(
      testingNetwork.ethereumExplorerLink
    )

    expect(within(nodes).getByTestId(vegaSubHeaderLocators.subHeader)).toHaveTextContent('Nodes')
    const nodeLinks = within(nodes).getAllByTestId(locators.networkDetailsNode)
    expect(nodeLinks).toHaveLength(testingNetwork.rest.length)
    for (const [index, link] of nodeLinks.entries()) {
      expect(link).toHaveTextContent(testingNetwork.rest[index])
    }
  })
  it('should render the configured nodes of the network', () => {})
})
