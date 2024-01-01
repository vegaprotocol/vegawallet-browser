import { useCallback, useState } from 'react'

import { useInteractionStore } from '@/stores/interaction-store'
import { useNetworksStore } from '@/stores/networks-store'

import locators from '../../locators'
import { Splash } from '../../splash'
import { ConnectionDetails } from './connection-details'
import { ConnectionSuccess } from './connection-success'

export const ConnectionModal = () => {
  const { isOpen, handleConnectionDecision, details } = useInteractionStore((store) => ({
    isOpen: store.connectionModalOpen,
    handleConnectionDecision: store.handleConnectionDecision,
    details: store.currentConnectionDetails
  }))
  const { networks } = useNetworksStore((store) => ({
    networks: store.networks
  }))
  const [hasConnected, setHasConnected] = useState(false) || {}
  const { id: networkId } = networks.find((network) => network.chainId === details?.chainId) || {}
  if (!networkId) {
    throw new Error(`Network could not be found with chainId ${details?.chainId}`)
  }
  const handleDecision = useCallback(
    (approved: boolean) => {
      if (!approved) {
        handleConnectionDecision({ approved, networkId })
      }
      setHasConnected(approved)
    },
    [handleConnectionDecision, networkId, setHasConnected]
  )

  if (!isOpen || !details) return null
  return (
    <Splash data-testid={locators.connectionModal} centered={true}>
      {hasConnected ? (
        <ConnectionSuccess
          hostname={details.origin}
          onClose={() => {
            setHasConnected(false)
            handleConnectionDecision({
              approved: true,
              networkId
            })
          }}
        />
      ) : (
        <ConnectionDetails hostname={details.origin} handleDecision={handleDecision} />
      )}
    </Splash>
  )
}
