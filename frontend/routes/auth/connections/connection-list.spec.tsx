import { fireEvent, render, screen } from '@testing-library/react'
import { ConnectionsList, locators } from './connection-list'
import { locators as hostImageLocators } from '../../../components/host-image'

describe('ConnectionList', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2021-01-01T00:00:00.000Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders list of connections passed in with image', () => {
    render(
      <ConnectionsList
        removeConnection={() => {}}
        connections={[
          {
            allowList: {
              publicKeys: [],
              wallets: ['Wallet 1']
            },
            accessedAt: Date.now(),
            origin: 'https://vega.xyz'
          },
          {
            allowList: {
              publicKeys: [],
              wallets: ['Wallet 1']
            },
            accessedAt: Date.now(),
            origin: 'foo.com'
          }
        ]}
      />
    )
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
        allowList: {
          publicKeys: [],
          wallets: ['Wallet 1']
        },
        origin: 'https://vega.xyz',
        Date.now()
      },
      {
        allowList: {
          publicKeys: [],
          wallets: ['Wallet 1']
        },
        Date.now(),
        origin: 'foo.com'
      }
    ]
    render(<ConnectionsList removeConnection={mockRemoveConnection} connections={connections} />)
    fireEvent.click(screen.getAllByTestId(locators.connectionRemoveConnection)[0])
    expect(mockRemoveConnection).toHaveBeenCalledWith(connections[0])
  })

  it('renders last accessed at time', () => {
    render(
      <ConnectionsList
        removeConnection={() => {}}
        connections={[
          {
            allowList: {
              publicKeys: [],
              wallets: ['Wallet 1']
            },
            origin: 'https://vega.xyz',
            Date.now()
          }
        ]}
      />
    )
    expect(screen.getByTestId(locators.connectionLastConnected)).toHaveTextContent(
      'Last connected: 1/1/2021 · 12:00:00 AM'
    )
  })
})
