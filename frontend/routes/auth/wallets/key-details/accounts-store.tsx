import { RpcMethods } from '../../../../lib/client-rpc-methods'
import { create } from 'zustand'
import { SendMessage } from '../../../../contexts/json-rpc/json-rpc-provider'
import { VegaAccount } from '../../../../types/rest-api'
import groupBy from 'lodash/groupBy'

const POLL_INTERVAL = 10000

// TODO this should be generated from the types from swagger
export interface Party {}

export type PartyStore = {
  accounts: VegaAccount[]
  accountsByAsset: Record<string, VegaAccount[]>
  interval: NodeJS.Timer | null
  fetchAccounts: (id: string, request: SendMessage) => Promise<void>
  startPoll: (id: string, request: SendMessage) => void
  stopPoll: () => void
  reset: () => void
}

export const useAccountsStore = create<PartyStore>()((set, get) => ({
  accounts: [],
  accountsByAsset: {},
  interval: null,
  async fetchAccounts(id, request) {
    const accountsResponse = await request(RpcMethods.Fetch, { path: `api/v2/accounts?filter.partyIds=${id}` })
    const accounts = accountsResponse.accounts.edges.map(({ node }: { node: VegaAccount }) => node) as VegaAccount[]
    const accountsByAsset = groupBy(accounts, 'asset')
    console.log(accounts)
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
  },
  reset() {
    set({
      accounts: []
    })
  }
}))
