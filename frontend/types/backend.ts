export interface AllowList {
  publicKeys: any[]
  wallets: string[]
}

export interface Connection {
  allowList: AllowList
  origin: string
  accessedAt: number
  id: string
}

export interface Wallet {
  name: string
  keys: Key[]
}

export interface Key {
  index: number
  metadata: Metadata[]
  name: string
  publicKey: string
}

export interface Metadata {
  key: string
  value: string
}

export interface Network {
  id: string
  name: string
  rest: string[]
  explorer: string
  // TODO needed?
  probing: boolean
  preferredNode: string | null
}
