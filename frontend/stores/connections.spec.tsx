import { useConnectionStore } from './connections'

const request = () => {
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

const initialState = useConnectionStore.getState()

describe('ConnectionsStore', () => {
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
})
