import { RpcMethods } from '@/lib/client-rpc-methods'

import { fairground, testingNetwork } from '../../config/well-known-networks'
import { useNetworksStore } from './networks-store'

const initialState = useNetworksStore.getState()

const globalsMock = {
  passphrase: true,
  locked: false,
  wallet: true,
  version: '0.0.1',
  settings: {
    selectedNetwork: testingNetwork.id
  }
}

const request = jest.fn().mockImplementation(async (method: string) => {
  if (method === RpcMethods.ListNetworks) {
    return { networks: [testingNetwork, fairground] }
  } else if (method === RpcMethods.AppGlobals) {
    return globalsMock
  }
  throw new Error('RPC method not in mock')
})

describe('NetworksStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useNetworksStore.setState(initialState)
  })
  it('loads networks', async () => {
    expect(useNetworksStore.getState().loading).toBe(true)
    expect(useNetworksStore.getState().networks).toStrictEqual([])
    expect(useNetworksStore.getState().selectedNetwork).toBeNull()
    await useNetworksStore.getState().loadNetworks(request)
    expect(useNetworksStore.getState().loading).toBe(false)
    expect(useNetworksStore.getState().networks).toStrictEqual([testingNetwork, fairground])
    expect(useNetworksStore.getState().selectedNetwork).toStrictEqual(testingNetwork)
  })
  it('throws error if selected network cannot be found', async () => {
    const net = globalsMock.settings.selectedNetwork
    globalsMock.settings.selectedNetwork = 'foo'
    await expect(useNetworksStore.getState().loadNetworks(request)).rejects.toThrow(
      'Could not find selected network foo'
    )

    globalsMock.settings.selectedNetwork = net
  })
  it('gets network by networkId', async () => {
    await useNetworksStore.getState().loadNetworks(request)
    const result = useNetworksStore.getState().getNetworkById(fairground.id)
    expect(result).toStrictEqual(fairground)
    const result2 = useNetworksStore.getState().getNetworkById('foo')
    expect(result2).toBeUndefined()
  })
})
