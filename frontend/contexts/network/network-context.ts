import { createContext, useContext } from 'react'

import { Network } from '@/types/backend'

export interface NetworkContextShape {
  network: Network
}

export const NetworkContext = createContext<NetworkContextShape | undefined>(undefined)

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (context === undefined) {
    throw new Error('useNetwork must be used within NetworkProvider')
  }
  return context
}