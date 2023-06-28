import { RpcMethods } from '../lib/client-rpc-methods'
import { useConnectionStore } from './connections'

const client = {
  request(method: string) {
    if (method === RpcMethods.ListConnections) {
      return {
        connections: [
          {
            allowList: {
              publicKeys: [],
              wallets: ['Wallet 1']
            },
            origin: 'https://vega.xyz'
          }
        ]
      }
    }
    return null
  }
}

const initialState = useConnectionStore.getState()

describe('Store', () => {
  beforeEach(() => {
    useConnectionStore.setState(initialState)
  })
  it('loads connections from backend', async () => {
    expect(useConnectionStore.getState().loading).toBe(true)
    expect(useConnectionStore.getState().connections).toStrictEqual([])
    await useConnectionStore.getState().loadConnections(request as unknown as any)
    expect(useConnectionStore.getState().loading).toBe(false)
    expect(useConnectionStore.getState().connections).toStrictEqual([
      {
        allowList: {
          publicKeys: [],
          wallets: ['Wallet 1']
        },
        origin: 'https://vega.xyz'
      }
    ])
  })
  it('adds connections from backend uniquely', () => {
    expect(useConnectionStore.getState().loading).toBe(true)
    expect(useConnectionStore.getState().connections).toStrictEqual([])
    useConnectionStore.getState().addConnection({
      allowList: {
        publicKeys: [],
        wallets: ['Wallet 1']
      },
      origin: 'https://vega.xyz'
    })
    expect(useConnectionStore.getState().connections).toStrictEqual([
      {
        allowList: {
          publicKeys: [],
          wallets: ['Wallet 1']
        },
        origin: 'https://vega.xyz'
      }
    ])
    useConnectionStore.getState().addConnection({
      allowList: {
        publicKeys: [],
        wallets: ['Wallet 1']
      },
      origin: 'https://vega.xyz'
    })
    expect(useConnectionStore.getState().connections).toStrictEqual([
      {
        allowList: {
          publicKeys: [],
          wallets: ['Wallet 1']
        },
        origin: 'https://vega.xyz'
      }
    ])
  })
  it('renders error if error is present', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await useConnectionStore.getState().loadConnections({
      request() {
        throw new Error('Something sideways')
      }
    } as unknown as any)
    expect(useConnectionStore.getState().error).toStrictEqual('Error: Something sideways')
    expect(useConnectionStore.getState().loading).toBe(false)
    expect(useConnectionStore.getState().connections).toStrictEqual([])
  })
  it('renders generic error if error message is not present', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await useConnectionStore.getState().loadConnections({
      request() {
        // eslint-disable-next-line no-throw-literal
        throw null
      }
    } as unknown as any)
    expect(useConnectionStore.getState().error).toStrictEqual('Something went wrong')
    expect(useConnectionStore.getState().loading).toBe(false)
    expect(useConnectionStore.getState().connections).toStrictEqual([])
  })
  it('removes connections from backend', async () => {
    const mockConnection = {
      allowList: {
        publicKeys: [],
        wallets: ['Wallet 1']
      },
      origin: 'https://vega.xyz'
    }
    useConnectionStore.setState({
      connections: [mockConnection]
    })

    await useConnectionStore.getState().removeConnection(client as unknown as any, mockConnection)
    expect(useConnectionStore.getState().connections).toStrictEqual([])
  })
  it('renders error if connections could not be removed', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const mockConnection = {
      allowList: {
        publicKeys: [],
        wallets: ['Wallet 1']
      },
      origin: 'https://vega.xyz'
    }
    useConnectionStore.setState({
      connections: [mockConnection]
    })

    await useConnectionStore.getState().removeConnection(
      {
        request() {
          throw new Error('Something sideways')
        }
      } as unknown as any,
      mockConnection
    )
    expect(useConnectionStore.getState().error).toStrictEqual('Error: Something sideways')
    expect(useConnectionStore.getState().connections).toStrictEqual([mockConnection])
  })

  it('renders generic error if error message is not present when removing connection', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const mockConnection = {
      allowList: {
        publicKeys: [],
        wallets: ['Wallet 1']
      },
      origin: 'https://vega.xyz'
    }
    useConnectionStore.setState({
      connections: [mockConnection]
    })

    await useConnectionStore.getState().removeConnection(
      {
        request() {
          // eslint-disable-next-line no-throw-literal
          throw null
        }
      } as unknown as any,
      mockConnection
    )
    expect(useConnectionStore.getState().error).toStrictEqual('Something went wrong')
    expect(useConnectionStore.getState().connections).toStrictEqual([mockConnection])
  })
})
