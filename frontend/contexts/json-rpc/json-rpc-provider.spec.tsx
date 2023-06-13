import { render, screen } from '@testing-library/react'
import { JsonRPCProvider } from './json-rpc-provider'
import { useJsonRpcClient } from './json-rpc-context'
import { useModalStore } from '../../lib/modal-store'
import { ServerRpcMethods } from '../../lib/server-rpc-methods'
import { RpcMethods } from '../../lib/client-rpc-methods'
import { useEffect } from 'react'
import { useConnectionStore } from '../../stores/connections'

jest.mock('../../lib/modal-store')
jest.mock('../../stores/connections')

const mockUseModalStore = () => {
  const store = useModalStore as jest.MockedFunction<typeof useModalStore>
  const handleConnection = jest.fn()
  const handleTransaction = jest.fn()
  store.mockImplementation(() => ({
    handleConnection,
    handleTransaction
  }))
  return {
    handleConnection,
    handleTransaction
  }
}

const mockConnectionStore = () => {
  const store = useConnectionStore as jest.MockedFunction<typeof useConnectionStore>
  const addConnection = jest.fn()
  store.mockImplementation(() => ({
    addConnection
  }))
  return {
    addConnection
  }
}

const TestComponent = ({ expect }: { expect: jest.Expect }) => {
  const { client, server } = useJsonRpcClient()
  expect(client).not.toBeNull()
  expect(server).not.toBeNull()
  return <div>Content</div>
}

describe('JsonRpcProvider', () => {
  beforeEach(() => {
    // @ts-ignore
    global.browser = {}
  })
  it('renders and provides client', () => {
    mockUseModalStore()
    mockConnectionStore()
    // @ts-ignore
    global.browser = {
      runtime: {
        connect: () => ({
          postMessage: () => {},
          onmessage: () => {},
          onMessage: {
            addListener: () => {}
          },
          onDisconnect: {
            addListener: (fn: any) => {}
          }
        })
      }
    }
    render(
      <JsonRPCProvider>
        <TestComponent expect={expect} />
      </JsonRPCProvider>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  it('throws error if hook is called outside context', () => {
    mockUseModalStore()
    mockConnectionStore()
    jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestComponent expect={expect} />)).toThrow(
      'useJsonRpcClient must be used within JsonRPCProvider'
    )
  })
  it('uses firefox runtime if available', () => {
    mockUseModalStore()
    mockConnectionStore()
    // @ts-ignore
    global.chrome = {
      runtime: {
        connect: () => ({
          postMessage: () => {},
          onmessage: () => {},
          // @ts-ignore
          onMessage: {
            addListener: () => {}
          },
          // @ts-ignore
          onDisconnect: {
            addListener: (fn: any) => {}
          }
        })
      }
    }
    render(
      <JsonRPCProvider>
        <TestComponent expect={expect} />
      </JsonRPCProvider>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  it('uses chrome runtime if available', () => {
    mockUseModalStore()
    mockConnectionStore()
    // @ts-ignore
    global.browser = {
      runtime: {
        connect: () => ({
          postMessage: () => {},
          onmessage: () => {},
          onMessage: {
            addListener: () => {}
          },
          onDisconnect: {
            addListener: (fn: any) => {}
          }
        })
      }
    }
    render(
      <JsonRPCProvider>
        <TestComponent expect={expect} />
      </JsonRPCProvider>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  it('handles connection notification messages', () => {
    mockUseModalStore()
    const { addConnection } = mockConnectionStore()
    const TestComponent = ({ expect }: { expect: jest.Expect }) => {
      const { client } = useJsonRpcClient()
      useEffect(() => {
        client.onmessage({
          jsonrpc: '2.0',
          method: RpcMethods.ConnectionsChange,
          params: {
            add: [
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
                origin: 'https://vega.wxyz'
              }
            ]
          }
        })
      }, [client])
      return <div>Content</div>
    }
    const mock = {
      runtime: {
        connect: () => ({
          postMessage: () => {},
          onmessage: () => {},
          onMessage: {
            addListener: () => {}
          },
          onDisconnect: {
            addListener: (fn: any) => {}
          }
        })
      }
    }
    // @ts-ignore
    global.browser = mock
    render(
      <JsonRPCProvider>
        <TestComponent expect={expect} />
      </JsonRPCProvider>
    )
    expect(addConnection).toBeCalledTimes(2)
    expect(addConnection).toBeCalledWith({
      allowList: {
        publicKeys: [],
        wallets: ['Wallet 1']
      },
      origin: 'https://vega.xyz'
    })
  })
  it('handles connection background interaction messages', () => {
    const { handleConnection } = mockUseModalStore()
    mockConnectionStore()
    const TestComponent = ({ expect }: { expect: jest.Expect }) => {
      const { server } = useJsonRpcClient()
      server.onrequest({
        jsonrpc: '2.0',
        id: '1',
        method: ServerRpcMethods.Connection,
        params: { details: 'some' }
      })
      return <div>Content</div>
    }
    const mock = {
      runtime: {
        connect: () => ({
          postMessage: () => {},
          onmessage: () => {},
          onMessage: {
            addListener: () => {}
          },
          onDisconnect: {
            addListener: (fn: any) => {}
          }
        })
      }
    }
    // @ts-ignore
    global.browser = mock
    render(
      <JsonRPCProvider>
        <TestComponent expect={expect} />
      </JsonRPCProvider>
    )
    expect(handleConnection).toHaveBeenCalled()
  })
  it('handles transaction background interaction messages', () => {
    const { handleTransaction } = mockUseModalStore()
    mockConnectionStore()

    const TestComponent = ({ expect }: { expect: jest.Expect }) => {
      const { server } = useJsonRpcClient()
      server.onrequest({
        jsonrpc: '2.0',
        id: '1',
        method: ServerRpcMethods.Transaction,
        params: { details: 'some' }
      })
      return <div>Content</div>
    }
    const mock = {
      runtime: {
        connect: () => ({
          postMessage: () => {},
          onmessage: () => {},
          onMessage: {
            addListener: () => {}
          },
          onDisconnect: {
            addListener: (fn: any) => {}
          }
        })
      }
    }
    // @ts-ignore
    global.browser = mock
    render(
      <JsonRPCProvider>
        <TestComponent expect={expect} />
      </JsonRPCProvider>
    )
    expect(handleTransaction).toHaveBeenCalled()
  })
})
