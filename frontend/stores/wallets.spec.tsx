import { RpcMethods } from '../lib/client-rpc-methods'
import { useWalletStore } from './wallets'

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
    if (method === RpcMethods.ListWallets) {
      return { wallets: ['Wallet 1'] }
    } else if (method === RpcMethods.ListKeys) {
      return {
        keys
      }
    } else if (method === RpcMethods.GenerateKey) {
      return {
        publicKey: '17248acbd899061ba9c5f3ab47791df2045c8e249f1805a04c2a943160533673',
        name: 'Key 2'
      }
    }
  }
}

const initialState = useWalletStore.getState()

describe('WalletsStore', () => {
  beforeEach(() => {
    useWalletStore.setState(initialState)
  })
  it('loads wallets from backend', async () => {
    expect(useWalletStore.getState().loading).toBe(true)
    expect(useWalletStore.getState().wallets).toStrictEqual([])
    await useWalletStore.getState().loadWallets(client as unknown as any)
    expect(useWalletStore.getState().loading).toBe(false)
    expect(useWalletStore.getState().wallets).toStrictEqual([
      {
        keys,
        name: 'Wallet 1'
      }
    ])
  })
  it('throws error if the wallet we are trying to create a key for could not be found', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(
      async () =>
        await useWalletStore.getState().createKey(
          {
            request(method: string) {
              // eslint-disable-next-line no-throw-literal
              throw null
            }
          } as unknown as any,
          'this wallet name does not exist'
        )
    ).toThrowError('Could not find wallet to create key for')
  })
  it('adds a new key onto wallet when creating a new key for that wallet', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await useWalletStore.getState().loadWallets(client as unknown as any)
    await useWalletStore.getState().createKey(client as unknown as any, 'Wallet 1')
    expect(useWalletStore.getState().wallets[0].keys).toHaveLength(2)
    const [key1, key2] = useWalletStore.getState().wallets[0].keys
    expect(key1.name).toBe('Key 1')
    expect(key2.name).toBe('Key 2')
  })
})
