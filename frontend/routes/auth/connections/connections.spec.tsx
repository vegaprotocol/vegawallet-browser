import { render, screen, act } from '@testing-library/react'
import { Connections } from '.'
import { mockClient } from '../../../test-helpers/mock-client'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import { connectionsConnection, connectionsNoConnections } from '../../../locator-ids'
import { ConnectionsStore, useConnectionStore } from './store'

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
  it('renders list of connections', async () => {
    mockClient()
    renderComponent()
    const [vega, foo] = await screen.findAllByTestId(connectionsConnection)
    expect(vega).toHaveTextContent('https://vega.xyz')
    expect(foo).toHaveTextContent('foo.com')
  })
  it('renders empty state', async () => {
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
    expect(container).toBeEmptyDOMElement()
  })
})
