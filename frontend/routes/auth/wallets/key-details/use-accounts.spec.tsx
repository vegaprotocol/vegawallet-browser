import { renderHook } from '@testing-library/react'
import { useAccounts } from './use-accounts'
import { AccountType } from '@vegaprotocol/types'
import { useAccountsStore } from './accounts-store'

const MOCK_KEY = '1'.repeat(64)
const ASSET_ID = '2'.repeat(64)
const MARKET_ID = '3'.repeat(64)

jest.mock('../../../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({
    request: jest.fn()
  })
}))

jest.mock('../../../../stores/wallets', () => ({
  useWalletStore: jest.fn().mockImplementation((fn) =>
    fn({
      getKeyById: jest.fn().mockReturnValue({
        publicKey: MOCK_KEY,
        name: 'test',
        index: 0,
        metadata: []
      })
    })
  )
}))

jest.mock('./accounts-store', () => ({
  useAccountsStore: jest.fn()
}))

describe('UseAccounts', () => {
  it('fetches the party, starts polling and returns the key and assets', () => {
    const fetchAccounts = jest.fn()
    const startPoll = jest.fn()
    const stopPoll = jest.fn()
    const reset = jest.fn()

    ;(useAccountsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        accountsByAsset: {
          [ASSET_ID]: {
            balance: '1',
            asset: ASSET_ID,
            market: MARKET_ID,
            party: MOCK_KEY,
            type: AccountType.ACCOUNT_TYPE_GENERAL
          }
        },
        fetchAccounts,
        startPoll,
        stopPoll,
        reset
      })
    )
    const view = renderHook(() => useAccounts(MOCK_KEY))
    const { key, accountsByAsset } = view.result.current
    expect(key).toStrictEqual({
      publicKey: MOCK_KEY,
      name: 'test',
      index: 0,
      metadata: []
    })
    expect(accountsByAsset).toStrictEqual({
      [ASSET_ID]: {
        balance: '1',
        asset: ASSET_ID,
        market: MARKET_ID,
        party: MOCK_KEY,
        type: 'ACCOUNT_TYPE_GENERAL'
      }
    })
    expect(fetchAccounts).toBeCalledTimes(1)
    expect(startPoll).toBeCalledTimes(1)
    expect(reset).toBeCalledTimes(0)
    expect(stopPoll).toBeCalledTimes(0)
    view.unmount()
    expect(fetchAccounts).toBeCalledTimes(1)
    expect(startPoll).toBeCalledTimes(1)
    expect(reset).toBeCalledTimes(1)
    expect(stopPoll).toBeCalledTimes(1)
  })
})
