import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { locators as hostImageLocators } from '@/components/host-image'

import { ConnectionsList, ConnectionsListProperties, locators } from './connection-list'

const renderComponent = (properties: ConnectionsListProperties) => {
  render(
    <MemoryRouter>
      <ConnectionsList {...properties} />
    </MemoryRouter>
  )
}

describe('ConnectionList', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2021-01-01T00:00:00.000Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders list of connections passed in with image', () => {
    renderComponent({
      removeConnection: () => {},
      connections: [
        {
          id: 'foo',
          allowList: {
            publicKeys: [],
            wallets: ['Wallet 1']
          },
          accessedAt: Date.now(),
          origin: 'https://vega.xyz'
        },
        {
          id: 'bar',
          allowList: {
            publicKeys: [],
            wallets: ['Wallet 1']
          },
          accessedAt: Date.now(),
          origin: 'foo.com'
        }
      ]
    })
    const connections = screen.getAllByTestId(locators.connectionOrigin)
    expect(connections).toHaveLength(2)
    const [vega, foo] = connections
    expect(vega).toHaveTextContent('https://vega.xyz')
    expect(foo).toHaveTextContent('foo.com')
    const images = screen.getAllByTestId(hostImageLocators.hostImage)
    expect(images).toHaveLength(2)
  })

  it('calls remove connection when cross button is clicked', async () => {
    const mockRemoveConnection = jest.fn()
    const connections = [
      {
        id: 'foo',
        allowList: {
          publicKeys: [],
          wallets: ['Wallet 1']
        },
        origin: 'https://vega.xyz',
        accessedAt: Date.now()
      },
      {
        id: 'bar',
        allowList: {
          publicKeys: [],
          wallets: ['Wallet 1']
        },
        accessedAt: Date.now(),
        origin: 'foo.com'
      }
    ]
    renderComponent({
      removeConnection: mockRemoveConnection,
      connections
    })
    fireEvent.click(screen.getAllByTestId(locators.connectionRemoveConnection)[0])
    expect(mockRemoveConnection).toHaveBeenCalledWith(connections[0])
  })

  // TODO replace in the connection details screen
  // it('renders last accessed at time', () => {
  //   render(
  //     <ConnectionsList
  //       removeConnection={() => {}}
  //       connections={[
  //         {
  //           id: 'foo',
  //           allowList: {
  //             publicKeys: [],
  //             wallets: ['Wallet 1']
  //           },
  //           origin: 'https://vega.xyz',
  //           accessedAt: Date.now()
  //         }
  //       ]}
  //     />
  //   )
  //   expect(screen.getByTestId(locators.connectionLastConnected)).toHaveTextContent(
  //     'Last connected: 1/1/2021 · 12:00:00 AM'
  //   )
  // })
})
