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
