import { RpcMethods } from '../../../../lib/client-rpc-methods'
import { create } from 'zustand'
import { SendMessage } from '../../../../contexts/json-rpc/json-rpc-provider'
import { Apiv1Account } from '../../../../types/rest-api'
import groupBy from 'lodash/groupBy'
import { removePaginationWrapper } from '../../../../lib/remove-pagination'

const POLL_INTERVAL = 10000

export type AccountsStore = {
  accounts: Apiv1Account[]
  accountsByAsset: Record<string, Apiv1Account[]>
  interval: NodeJS.Timer | null
  fetchAccounts: (id: string, request: SendMessage) => Promise<void>
  startPoll: (id: string, request: SendMessage) => void
  stopPoll: () => void
  reset: () => void
}

export const useAccountsStore = create<AccountsStore>()((set, get) => ({
  accounts: [],
  accountsByAsset: {},
  interval: null,
  async fetchAccounts(id, request) {
    const accountsResponse = await request(RpcMethods.Fetch, { path: `api/v2/accounts?filter.partyIds=${id}` })
    const accounts = removePaginationWrapper<Apiv1Account>(accountsResponse.accounts.edges)
    const accountsByAsset = groupBy(accounts, 'asset')
    set({
      accounts,
      accountsByAsset
    })
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
      accounts: [],
      accountsByAsset: {}
    })
  }
}))
