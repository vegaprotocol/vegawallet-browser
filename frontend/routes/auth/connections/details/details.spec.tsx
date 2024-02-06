import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, useParams } from 'react-router-dom'

import { locators as vegaSubHeaderLocators } from '@/components/sub-header'
import { locators as vegaSectionLocators } from '@/components/vega-section'
import { useConnectionStore } from '@/stores/connections'
import { mockStore } from '@/test-helpers/mock-store'
import { silenceErrors } from '@/test-helpers/silence-errors'

import { ConnectionDetails, locators } from './details'

const request = jest.fn()
jest.mock('@/contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({ request })
}))

jest.mock('@/stores/connections')

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}))

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <ConnectionDetails />
    </MemoryRouter>
  )
}

describe('ConnectionDetails', () => {
  it('throws error if id parameter is not defined', () => {
    silenceErrors()
    ;(useParams as jest.Mock).mockReturnValue({ id: undefined })
    expect(() => renderComponent()).toThrow('Id param not provided to connection details')
  })
  it('throws error if connection could not be found', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: encodeURI('test') })
    mockStore(useConnectionStore, { connections: [] })
    expect(() => renderComponent()).toThrow('Could not find connection with origin test')
  })
  it('returns null while loading', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: encodeURI('test') })
    mockStore(useConnectionStore, { connections: [], loading: true })
    const { container } = renderComponent()
    expect(container).toBeEmptyDOMElement()
  })
  it('renders connection details', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: encodeURI('test') })
    const connection = {
      origin: 'test',
      accessedAt: 0,
      chainId: 'chainId',
      networkId: 'networkId'
    }
    mockStore(useConnectionStore, {
      connections: [connection],
      loading: false,
      removeConnection: jest.fn()
    })
    renderComponent()
    const sections = await screen.findAllByTestId(vegaSectionLocators.vegaSection)
    const [lastAccessed, chainId, networkId] = sections
    expect(within(lastAccessed).getByTestId(vegaSubHeaderLocators.subHeader)).toHaveTextContent('Last accessed')
    expect(within(lastAccessed).getByTestId(locators.accessedAt)).toHaveTextContent('1/1/1970, 12:00:00 AM')

    expect(within(chainId).getByTestId(vegaSubHeaderLocators.subHeader)).toHaveTextContent('Chain Id')
    expect(within(chainId).getByTestId(locators.chainId)).toHaveTextContent(connection.chainId)

    const networkIdLink = within(networkId).getByTestId(locators.networkId)
    expect(within(networkId).getByTestId(vegaSubHeaderLocators.subHeader)).toHaveTextContent('Network Id')
    expect(networkIdLink).toHaveTextContent(connection.networkId)
    expect(networkIdLink).toHaveAttribute('href', '/auth/settings/networks/networkId')

    expect(screen.getByTestId(locators.removeConnection)).toHaveTextContent('Remove connection')
  })
  it('allows removing of connection', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: encodeURI('test') })
    const removeConnection = jest.fn()
    const connection = {
      origin: 'test',
      accessedAt: 0,
      chainId: 'chainId',
      networkId: 'networkId'
    }
    mockStore(useConnectionStore, {
      connections: [connection],
      loading: false,
      removeConnection
    })
    renderComponent()
    const removeButton = screen.getByTestId(locators.removeConnection)
    fireEvent.click(removeButton)
    expect(removeConnection).toHaveBeenCalledWith(request, connection)
  })
})
