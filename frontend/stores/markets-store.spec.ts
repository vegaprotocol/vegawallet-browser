import { RpcMethods } from '../lib/client-rpc-methods'
import { useMarketsStore } from './markets-store'

const marketsMock = {
  markets: {
    edges: [
      {
        node: {
          id: 'market-1'
        },
        cursor: 'cursor-1'
      },
      {
        node: {
          id: 'market-2'
        },
        cursor: 'cursor-2'
      }
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: 'start-cursor',
      endCursor: 'end-cursor'
    }
  }
}

const request = async (method: string) => {
  if (method === RpcMethods.Fetch) {
    return marketsMock
  }
  throw new Error('Failed to fetch markets')
}

const initialState = useMarketsStore.getState()

describe('MarketsStore', () => {
  beforeEach(() => {
    useMarketsStore.setState(initialState)
  })

  it('loads markets', async () => {
    expect(useMarketsStore.getState().loading).toBe(false)
    expect(useMarketsStore.getState().markets).toStrictEqual([])
    await useMarketsStore.getState().fetchMarkets(request as unknown as any)
    expect(useMarketsStore.getState().loading).toBe(false)
    expect(useMarketsStore.getState().markets).toHaveLength(2)
  })

  it('sets loading state while fetching', async () => {
    useMarketsStore.getState().fetchMarkets(request as unknown as any)
    expect(useMarketsStore.getState().loading).toBe(true)
  })

  it('allows you to fetch a market by id', async () => {
    await useMarketsStore.getState().fetchMarkets(request as unknown as any)
    const market = useMarketsStore.getState().getMarketById('market-1')
    expect(market).toStrictEqual(marketsMock.markets.edges[0].node)
  })

  it('throws error if the market is not found', async () => {
    await useMarketsStore.getState().fetchMarkets(request as unknown as any)
    expect(() => useMarketsStore.getState().getMarketById('nope')).toThrowError('Market with id nope not found')
  })
})
