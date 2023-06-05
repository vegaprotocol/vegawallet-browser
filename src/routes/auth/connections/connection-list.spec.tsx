import { render, screen } from '@testing-library/react'
import { ConnectionsList } from './connection-list'
import locators from '../../../components/locators'
import { connectionsConnection } from '../../../locator-ids'

describe('ConnectionList', () => {
  it('renders list of connections passed in with image', () => {
    render(
      <ConnectionsList
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
    const connections = screen.getAllByTestId(connectionsConnection)
    expect(connections).toHaveLength(2)
    const [vega, foo] = connections
    expect(vega).toHaveTextContent('https://vega.xyz')
    expect(foo).toHaveTextContent('foo.com')
    const images = screen.getAllByTestId(locators.hostImage)
    expect(images).toHaveLength(2)
  })
})
