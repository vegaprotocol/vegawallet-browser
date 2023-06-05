import { RpcMethods } from '../../../lib/client-rpc-methods'
import { useConnectionStore } from './store'

const keys = [
  {
    publicKey: '07248acbd899061ba9c5f3ab47791df2045c8e249f1805a04c2a943160533673',
    name: 'Key 1',
    index: 0,
    metadata: [
      {
        key: 'name',
        value: 'key 1'
      }
    ]
  }
]

const client = {
  request(method: string) {
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
}

const initialState = useConnectionStore.getState()

describe('Store', () => {
  beforeEach(() => {
    useConnectionStore.setState(initialState)
  })
  it('loads connections from backend', async () => {
    expect(useConnectionStore.getState().error).toBe(null)
    expect(useConnectionStore.getState().loading).toBe(true)
    expect(useConnectionStore.getState().connections).toStrictEqual([])
    await useConnectionStore.getState().loadConnections(client as unknown as any)
    expect(useConnectionStore.getState().error).toBe(null)
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
  it('renders error if error is present', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await useConnectionStore.getState().loadConnections({
      request(method: string) {
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
      request(method: string) {
        // eslint-disable-next-line no-throw-literal
        throw null
      }
    } as unknown as any)
    expect(useConnectionStore.getState().error).toStrictEqual('Something went wrong')
    expect(useConnectionStore.getState().loading).toBe(false)
    expect(useConnectionStore.getState().connections).toStrictEqual([])
  })
})
