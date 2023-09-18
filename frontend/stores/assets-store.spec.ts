import { RpcMethods } from '../lib/client-rpc-methods'
import { useAssetsStore } from './assets-store'

const assetsMock = {
  assets: {
    edges: [
      {
        node: {
          id: 'b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663',
          details: {
            name: 'tDAI TEST',
            symbol: 'tDAI',
            decimals: '5',
            quantum: '1',
            erc20: {
              contractAddress: '0x26223f9C67871CFcEa329975f7BC0C9cB8FBDb9b',
              lifetimeLimit: '0',
              withdrawThreshold: '0'
            }
          },
          status: 'STATUS_ENABLED'
        },
        cursor: 'eyJpZCI6ImIzNDBjMTMwMDk2ODE5NDI4YTYyZTVkZjQwN2ZkNmFiZTY2ZTQ0NGI4OWFkNjRmNjcwYmViOTg2MjFjOWM2NjMifQ=='
      },
      {
        node: {
          id: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
          details: {
            name: 'Vega (fairground)',
            symbol: 'VEGA',
            decimals: '18',
            quantum: '1',
            erc20: {
              contractAddress: '0xdf1B0F223cb8c7aB3Ef8469e529fe81E73089BD9',
              lifetimeLimit: '0',
              withdrawThreshold: '0'
            }
          },
          status: 'STATUS_ENABLED'
        },
        cursor: 'eyJpZCI6ImZjN2ZkOTU2MDc4ZmIxZmM5ZGI1YzE5Yjg4ZjA4NzRjNDI5OWIyYTc2MzlhZDA1YTQ3YTI4YzBhZWYyOTFiNTUifQ=='
      }
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor:
        'eyJpZCI6ImZkZjBlYzExOGQ5ODM5M2E3NzAyY2Y3MmU0NmZjODdhZDY4MGIxNTJmNjRiMmFhYzU5ZTA5M2FjMmQ2ODhmYmIifQ==',
      endCursor: 'eyJpZCI6IlhZWmFscGhhIn0='
    }
  }
}

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

  it('allows you to fetch an asset by id', async () => {
    await useAssetsStore.getState().fetchAssets(request as unknown as any)
    const asset = useAssetsStore
      .getState()
      .getAssetById('fdf0ec118d98393a7702cf72e46fc87ad680b152f64b2aac59e093ac2d688fbb')
    expect(asset).toStrictEqual(assetsMock.assets.edges[0].node)
  })

  it('throws error if the asset is not found', async () => {
    await useAssetsStore.getState().fetchAssets(request as unknown as any)
    expect(() =>
      useAssetsStore.getState().getAssetById('fdf0ec118d98393a7702cf72e46fc87ad680b152f64b2aac59e093ac2d688fbc')
    ).toThrowError('Asset with id fdf0ec118d98393a7702cf72e46fc87ad680b152f64b2aac59e093ac2d688fbc not found')
  })
})
