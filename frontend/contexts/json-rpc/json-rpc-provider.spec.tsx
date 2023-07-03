import { render, screen, waitFor } from '@testing-library/react'
import { JsonRPCProvider } from './json-rpc-provider'
import { useJsonRpcClient } from './json-rpc-context'
import { useModalStore } from '../../lib/modal-store'
import { ServerRpcMethods } from '../../lib/server-rpc-methods'
import { RpcMethods } from '../../lib/client-rpc-methods'
import { useEffect } from 'react'
import { useConnectionStore } from '../../stores/connections'
import { useErrorStore } from '../../stores/error'
import { mockClient } from '../../test-helpers/mock-client'

jest.mock('../../lib/modal-store')
jest.mock('../../stores/error')
jest.mock('../../stores/connections')

const mockModalStore = () => {
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

const mockErrorStore = () => {
  const setError = jest.fn()
  ;(useErrorStore as unknown as jest.Mock).mockImplementation((fn) => {
    return fn({
      setError
    })
  })
  return {
    setError
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
    jest.clearAllMocks()
  })
  it('renders and provides client', () => {
    mockModalStore()
    mockConnectionStore()
    mockErrorStore()
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
    mockModalStore()
    mockConnectionStore()
    mockErrorStore()
    jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestComponent expect={expect} />)).toThrow(
      'useJsonRpcClient must be used within JsonRPCProvider'
    )
  })
  it('uses firefox runtime if available', () => {
    mockModalStore()
    mockConnectionStore()
    mockErrorStore()
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
    mockModalStore()
    mockConnectionStore()
    mockErrorStore()
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
    mockModalStore()
    mockErrorStore()
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
    const { handleConnection } = mockModalStore()
    mockConnectionStore()
    mockErrorStore()
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
    const { handleTransaction } = mockModalStore()
    mockErrorStore()
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
  it('sets error message if a request fails when using the request methods', async () => {
    mockClient()
    mockModalStore()
    mockConnectionStore()
    const { setError } = mockErrorStore()

    const TestComponent = () => {
      const { request } = useJsonRpcClient()
      useEffect(() => {
        request('a.method.that.does.not.exist')
      }, [request])
      return <div>Content</div>
    }
    render(
      <JsonRPCProvider>
        <TestComponent />
      </JsonRPCProvider>
    )
    await waitFor(() => expect(setError).toBeCalledTimes(1))
    expect(setError).toBeCalledWith(new Error('Method not found'))
  })
  it('throws error message if a request fails when using the request methods and propagate is true', async () => {
    mockClient()
    mockModalStore()
    mockConnectionStore()
    const { setError } = mockErrorStore()

    const resolved = jest.fn()
    const TestComponent = ({ expect }: { expect: jest.Expect }) => {
      const { request } = useJsonRpcClient()
      useEffect(() => {
        const run = async () => {
          const req = request('a.method.that.does.not.exist', null, true)
          await expect(req).rejects.toThrow('Method not found')
          try {
            await req
          } catch (e) {
            resolved()
          }
        }
        run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [request])
      return <div>Content</div>
    }
    render(
      <JsonRPCProvider>
        <TestComponent expect={expect} />
      </JsonRPCProvider>
    )
    await waitFor(() => expect(resolved).toBeCalledTimes(1))
    expect(setError).toBeCalledTimes(0)
  })
})
