import { RpcMethods } from '../../../../lib/client-rpc-methods'
import { create } from 'zustand'
import { SendMessage } from '../../../../contexts/json-rpc/json-rpc-provider'

const POLL_INTERVAL = 10000

// TODO this should be generated from the types from swagger
export interface Party {}

export type PartyStore = {
  party: Party | null
  interval: NodeJS.Timer | null
  fetchParty: (id: string, request: SendMessage) => Promise<void>
  startPoll: (id: string, request: SendMessage) => void
  stopPoll: () => void
  reset: () => void
}

export const usePartyStore = create<PartyStore>()((set, get) => ({
  party: null,
  interval: null,
  async fetchParty(id, request) {
    const party = await request(RpcMethods.Fetch, { path: `api/v2/accounts?filter.partyIds=${id}` })
    set({
      party
    })
  },
  startPoll(id, request) {
    const interval = setInterval(() => {
      get().fetchParty(id, request)
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
      party: null
    })
  }
}))
