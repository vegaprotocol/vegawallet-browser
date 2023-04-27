import { useWalletStore } from './store'

const keys = [
  {
    publicKey:
      '07248acbd899061ba9c5f3ab47791df2045c8e249f1805a04c2a943160533673',
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
    if (method === 'admin.list_wallets') {
      return { wallets: ['Wallet 1'] }
    } else if (method === 'admin.list_keys') {
      return {
        keys
      }
    }
  }
}

const initialState = useWalletStore.getState()

describe('Store', () => {
  beforeEach(() => {
    useWalletStore.setState(initialState)
  })
  it('loads wallets from backend', async () => {
    expect(useWalletStore.getState().error).toBe(null)
    expect(useWalletStore.getState().loading).toBe(true)
    expect(useWalletStore.getState().wallets).toStrictEqual([])
    await useWalletStore.getState().loadWallets(client as unknown as any)
    expect(useWalletStore.getState().error).toBe(null)
    expect(useWalletStore.getState().loading).toBe(false)
    expect(useWalletStore.getState().wallets).toStrictEqual([
      {
        keys,
        name: 'Wallet 1'
      }
    ])
  })
  it('renders error if error is present', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await useWalletStore.getState().loadWallets({
      request(method: string) {
        throw new Error('Something sideways')
      }
    } as unknown as any)
    expect(useWalletStore.getState().error).toStrictEqual(
      'Error: Something sideways'
    )
    expect(useWalletStore.getState().loading).toBe(false)
    expect(useWalletStore.getState().wallets).toStrictEqual([])
  })
  it('renders generic error if error message is not present', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await useWalletStore.getState().loadWallets({
      request(method: string) {
        // eslint-disable-next-line no-throw-literal
        throw null
      }
    } as unknown as any)
    expect(useWalletStore.getState().error).toStrictEqual(
      'Something went wrong'
    )
    expect(useWalletStore.getState().loading).toBe(false)
    expect(useWalletStore.getState().wallets).toStrictEqual([])
  })
})
