import { RpcMethods } from '../../lib/client-rpc-methods'
import { silenceErrors } from '../../test-helpers/silence-errors'
import { useHomeStore } from './store'

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

const initialState = useHomeStore.getState()

describe('Store', () => {
  beforeEach(() => {
    useHomeStore.setState(initialState)
  })
  it('loads wallets from backend', async () => {
    expect(useHomeStore.getState().error).toBe(null)
    expect(useHomeStore.getState().loading).toBe(true)
    expect(useHomeStore.getState().globals).toBeNull()
    await useHomeStore.getState().loadGlobals(client as unknown as any)
    expect(useHomeStore.getState().error).toBe(null)
    expect(useHomeStore.getState().loading).toBe(false)
    expect(useHomeStore.getState().globals).toStrictEqual(globalsMock)
  })
  it('renders error if error is present', async () => {
    silenceErrors()
    await useHomeStore.getState().loadGlobals({
      request(method: string) {
        throw new Error('Something sideways')
      }
    } as unknown as any)
    expect(useHomeStore.getState().error).toStrictEqual('Error: Something sideways')
    expect(useHomeStore.getState().loading).toBe(false)
    expect(useHomeStore.getState().globals).toBeNull()
  })
  it('renders generic error if error message is not present', async () => {
    silenceErrors()
    await useHomeStore.getState().loadGlobals({
      request(method: string) {
        // eslint-disable-next-line no-throw-literal
        throw null
      }
    } as unknown as any)
    expect(useHomeStore.getState().error).toStrictEqual('Something went wrong')
    expect(useHomeStore.getState().loading).toBe(false)
    expect(useHomeStore.getState().globals).toBeNull()
  })
})
