import { RpcMethods } from '../lib/client-rpc-methods'
import { useGlobalsStore } from './globals'

const globalsMock = {
  passphrase: true,
  locked: false,
  wallet: true,
  version: '0.0.1',
  settings: {
    telemetry: false
  }
}

const client = {
  request(method: string) {
    if (method === RpcMethods.AppGlobals) {
      return globalsMock
    }
  }
}

const initialState = useGlobalsStore.getState()

describe('GlobalsStore', () => {
  beforeEach(() => {
    useGlobalsStore.setState(initialState)
  })
  it('loads wallets from backend', async () => {
    expect(useGlobalsStore.getState().error).toBe(null)
    expect(useGlobalsStore.getState().loading).toBe(true)
    expect(useGlobalsStore.getState().globals).toBeNull()
    await useGlobalsStore.getState().loadGlobals(client as unknown as any)
    expect(useGlobalsStore.getState().error).toBe(null)
    expect(useGlobalsStore.getState().loading).toBe(false)
    expect(useGlobalsStore.getState().globals).toStrictEqual(globalsMock)
  })
  it('renders error if error is present', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await useGlobalsStore.getState().loadGlobals({
      request(method: string) {
        throw new Error('Something sideways')
      }
    } as unknown as any)
    expect(useGlobalsStore.getState().error).toStrictEqual('Error: Something sideways')
    expect(useGlobalsStore.getState().loading).toBe(false)
    expect(useGlobalsStore.getState().globals).toBeNull()
  })
  it('renders generic error if error message is not present', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await useGlobalsStore.getState().loadGlobals({
      request(method: string) {
        // eslint-disable-next-line no-throw-literal
        throw null
      }
    } as unknown as any)
    expect(useGlobalsStore.getState().error).toStrictEqual('Something went wrong')
    expect(useGlobalsStore.getState().loading).toBe(false)
    expect(useGlobalsStore.getState().globals).toBeNull()
  })
})
