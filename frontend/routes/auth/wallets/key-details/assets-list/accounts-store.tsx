import { vegaAccount } from '@vegaprotocol/rest-clients/dist/trading-data'
import groupBy from 'lodash/groupBy'
import { create } from 'zustand'

import { SendMessage } from '../../../../../contexts/json-rpc/json-rpc-provider'
import { RpcMethods } from '../../../../../lib/client-rpc-methods'
import { removePaginationWrapper } from '../../../../../lib/remove-pagination'

const POLL_INTERVAL = 10_000

export type AccountsStore = {
  accounts: vegaAccount[]
  accountsByAsset: Record<string, vegaAccount[]>
  interval: NodeJS.Timer | null
  error: Error | null
  loading: boolean
  fetchAccounts: (id: string, request: SendMessage) => Promise<void>
  startPoll: (id: string, request: SendMessage) => void
  stopPoll: () => void
  reset: () => void
}

export const useAccountsStore = create<AccountsStore>()((set, get) => ({
  accounts: [],
  accountsByAsset: {},
  interval: null,
  error: null,
  loading: true,
  async fetchAccounts(id, request) {
    try {
      set({ loading: true, error: null })
      const accountsResponse = await request(RpcMethods.Fetch, { path: `api/v2/accounts?filter.partyIds=${id}` }, true)
      const accounts = removePaginationWrapper<vegaAccount>(accountsResponse.accounts.edges)
      const accountsByAsset = groupBy(accounts, 'asset')
      set({
        accounts,
        accountsByAsset
      })
    } catch (error) {
      set({
        error: error as Error
      })
    } finally {
      set({ loading: false })
    }
  },
  startPoll(id, request) {
    const interval = setInterval(() => {
      get().fetchAccounts(id, request)
    }, POLL_INTERVAL)
    set({
      interval
    })
  },
  stopPoll() {
    const { interval } = get()
    if (interval) {
      clearInterval(interval)
    }
    set({
      interval: null
    })
  },
  reset() {
    set({
      loading: true,
      // error: null,
      accounts: [],
      accountsByAsset: {}
    })
  }
}))
