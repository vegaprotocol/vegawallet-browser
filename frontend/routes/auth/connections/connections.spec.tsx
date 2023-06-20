import { render, screen, act, waitFor } from '@testing-library/react'
import { Connections, locators as connectionsLocators } from '.'
import { mockClient } from '../../../test-helpers/mock-client'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import { connectionsConnection, connectionsNoConnections } from '../../../locator-ids'
import { ConnectionsStore, useConnectionStore } from '../../../stores/connections'
import { locators as connectionListLocators } from './connection-list'

const renderComponent = () =>
  render(
    <JsonRPCProvider>
      <Connections />
    </JsonRPCProvider>
  )

describe('Connections', () => {
  let initialState: ConnectionsStore | null = null

  beforeEach(() => {
    initialState = useConnectionStore.getState()
  })
  afterEach(() => {
    // @ts-ignore
    global.browser = null
    act(() => useConnectionStore.setState(initialState as ConnectionsStore))
  })
  it('renders sorted list of connections with instructions on how to connect', async () => {
    mockClient()
    renderComponent()
    const [foo, vega] = await screen.findAllByTestId(connectionsConnection)
    expect(vega).toHaveTextContent('https://vega.xyz')
    expect(foo).toHaveTextContent('foo.com')
    // 1101-BWAL-081 I can see an explanation of what it means i.e. these dapps have permission to access my keys and connect to my wallet
    expect(screen.getByTestId(connectionListLocators.connectionDetails)).toHaveTextContent(
      'These dapps have access to your public keys and permission to send transaction requests.'
    )
    // 1101-BWAL-082 I can see instructions how to connect to a Vega dapp
    // 1101-BWAL-083 There is a way to see the dapps I could connect with (e.g. a link to https://vega.xyz/use)
    expect(screen.getByTestId(connectionsLocators.connectionInstructions)).toHaveTextContent(
      'Trying to connect to a Vega dApp? Look for the "Connect Wallet" button and press it to create a connection.'
    )
    expect(screen.getByTestId(connectionsLocators.connectionInstructionsLink)).toHaveAttribute(
      'href',
      'https://vega.xyz/use'
    )
  })
  it('renders empty state with instructions on how to connect', async () => {
    let listeners: Function[] = []
    // @ts-ignore
    global.browser = {
      runtime: {
        connect: () => ({
          postMessage: (message: any) => {
            listeners[0]({
              id: message.id,
              jsonrpc: '2.0',
              result: {
                connections: []
              }
            })
          },
          onmessage: () => {},
          onMessage: {
            addListener: (fn: any) => {
              listeners.push(fn)
            }
          },
          onDisconnect: {
            addListener: (fn: any) => {}
          }
        })
      }
    }
    renderComponent()
    await screen.findByTestId(connectionsNoConnections)
    expect(screen.getByTestId(connectionsNoConnections)).toBeInTheDocument()
    // 1101-BWAL-084 When I have no connections I can see that and still see instructions on how to connect to a Vega dapp
    expect(screen.getByTestId(connectionsLocators.connectionInstructions)).toBeVisible()
  })
  it('renders nothing if there is an error', async () => {
    let listeners: Function[] = []
    // @ts-ignore
    global.browser = {
      runtime: {
        connect: () => ({
          postMessage: (message: any) => {
            listeners[0]({
              id: message.id,
              jsonrpc: '2.0',
              error: {
                message: 'Some error',
                code: 1,
                data: {}
              }
            })
          },
          onmessage: () => {},
          onMessage: {
            addListener: (fn: any) => {
              listeners.push(fn)
            }
          },
          onDisconnect: {
            addListener: (fn: any) => {}
          }
        })
      }
    }
    const { container } = renderComponent()
    await waitFor(() => expect(container).toBeEmptyDOMElement())
  })
})
