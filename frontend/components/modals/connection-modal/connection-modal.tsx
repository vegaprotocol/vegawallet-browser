import { useCallback, useState } from 'react'

import { useErrorStore } from '@/stores/error'
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
  const { setError } = useErrorStore((store) => ({
    setError: store.setError
  }))
  const { networks } = useNetworksStore((store) => ({
    networks: store.networks
  }))
  const [hasConnected, setHasConnected] = useState(false)

  const sendConnectionDecision = useCallback(
    (approved: boolean) => {
      const { id: networkId } = networks.find((network) => network.chainId === details?.chainId) || {}
      if (!networkId) {
        setError(new Error(`Network could not be found with chainId ${details?.chainId}`))
        return
      }
      handleConnectionDecision({ approved, networkId })
    },
    [details?.chainId, handleConnectionDecision, networks, setError]
  )
  const handleDecision = useCallback(
    (approved: boolean) => {
      if (!approved) {
        sendConnectionDecision(approved)
      }
      setHasConnected(approved)
    },
    [sendConnectionDecision, setHasConnected]
  )

  if (!isOpen || !details) return null
  return (
    <Splash data-testid={locators.connectionModal} centered={true}>
      {hasConnected ? (
        <ConnectionSuccess
          hostname={details.origin}
          onClose={() => {
            setHasConnected(false)
            sendConnectionDecision(true)
          }}
        />
      ) : (
        <ConnectionDetails hostname={details.origin} handleDecision={handleDecision} />
      )}
    </Splash>
  )
}
