import { RpcMethods } from '../lib/client-rpc-methods'
import { useAssetsStore } from './assets-store'

const assetsMock = [
  {
    id: 'd1984e3d365faa05bcafbe41f50f90e3663ee7c0da22bb1e24b164e9532691b2',
    name: 'VEGA',
    symbol: 'VEGA',
    decimals: 18,
    quantum: '1000000000000000000',
    source: {
      __typename: 'ERC20',
      contractAddress: '0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e',
      lifetimeLimit: '0',
      withdrawThreshold: '0'
    },
    status: 'STATUS_ENABLED',
    infrastructureFeeAccount: {
      balance: '72',
      __typename: 'AccountBalance'
    },
    globalRewardPoolAccount: {
      balance: '136085',
      __typename: 'AccountBalance'
    },
    takerFeeRewardAccount: {
      balance: '2',
      __typename: 'AccountBalance'
    },
    makerFeeRewardAccount: {
      balance: '18468',
      __typename: 'AccountBalance'
    },
    lpFeeRewardAccount: {
      balance: '0',
      __typename: 'AccountBalance'
    },
    marketProposerRewardAccount: null,
    __typename: 'Asset'
  }
]

const request = async (method: string) => {
  if (method === RpcMethods.Fetch) {
    return assetsMock
  }
  throw new Error('Failed to fetch assets')
}

const initialState = useAssetsStore.getState()

describe('AssetsStore', () => {
  beforeEach(() => {
    useAssetsStore.setState(initialState)
  })

  it('loads assets', async () => {
    expect(useAssetsStore.getState().loading).toBe(false)
    expect(useAssetsStore.getState().assets).toBeNull()
    await useAssetsStore.getState().fetchAssets(request as unknown as any)
    expect(useAssetsStore.getState().loading).toBe(false)
    expect(useAssetsStore.getState().assets).toStrictEqual(assetsMock)
  })

  it('sets loading state while fetching', async () => {
    useAssetsStore.getState().fetchAssets(request as unknown as any)
    expect(useAssetsStore.getState().loading).toBe(true)
  })

  it('sets error state on failure', async () => {
    const failingRequest = async () => {
      throw new Error('Failed to fetch')
    }
    await useAssetsStore.getState().fetchAssets(failingRequest as unknown as any)
    expect(useAssetsStore.getState().error).toBe('Failed to fetch assets')
  })
})
