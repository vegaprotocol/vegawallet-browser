import { Transaction } from '@/lib/transactions'

export interface AllowList {
  publicKeys: any[]
  wallets: string[]
}

export interface Connection {
  allowList: AllowList
  origin: string
  accessedAt: number
  chainId: string
  networkId: string
  autoConsent: boolean
}

export interface Wallet {
  name: string
  keys: Key[]
}

export interface Key {
  index: number
  name: string
  publicKey: string
}

export interface Network {
  id: string
  color: string
  secondaryColor: string
  name: string
  chainId: string
  hidden: boolean
  rest: string[]
  console: string
  ethereumExplorerLink: string
  explorer: string
  governance: string
  docs: string
  vegaDapps: string
}

export type TransactionState = 'Confirmed' | 'Rejected' | 'Error'

export interface StoredTransaction {
  id: string
  transaction: Transaction
  publicKey: string
  sendingMode: string
  keyName: string
  walletName: string
  origin: string
  node?: string
  receivedAt: string // Date
  error?: string
  networkId: string
  chainId: string
  decision: string // Date
  state: TransactionState
  code: number
  hash: string
}
