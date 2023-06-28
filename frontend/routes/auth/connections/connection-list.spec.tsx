import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ConnectionsList, locators } from './connection-list'
import { locators as hostImageLocators } from '../../../components/host-image'
import { mockClient } from '../../../test-helpers/mock-client'

describe('ConnectionList', () => {
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
            origin: 'https://vega.xyz'
          },
          {
            allowList: {
              publicKeys: [],
              wallets: ['Wallet 1']
            },
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
    render(
      <ConnectionsList
        removeConnection={mockRemoveConnection}
        connections={[
          {
            allowList: {
              publicKeys: [],
              wallets: ['Wallet 1']
            },
            origin: 'https://vega.xyz'
          },
          {
            allowList: {
              publicKeys: [],
              wallets: ['Wallet 1']
            },
            origin: 'foo.com'
          }
        ]}
      />
    )
    fireEvent.click(screen.getAllByTestId(locators.connectionRemoveConnection)[0])
    expect(mockRemoveConnection).toHaveBeenCalledWith({
      allowList: {
        publicKeys: [],
        wallets: ['Wallet 1']
      },
      origin: 'https://vega.xyz'
    })
  })
})
