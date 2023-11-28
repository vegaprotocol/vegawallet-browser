import { useCallback, useState } from 'react'

import { useInteractionStore } from '@/stores/interaction-store'
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
  const [hasConnected, setHasConnected] = useState(false)
  const handleDecision = useCallback(
    (decision: boolean) => {
      if (!decision) {
        handleConnectionDecision(decision)
      }
      setHasConnected(decision)
    },
    [handleConnectionDecision]
  )

  if (!isOpen || !details) return null
  return (
    <Splash data-testid={locators.connectionModal} centered={true}>
      {hasConnected ? (
        <ConnectionSuccess
          hostname={details.origin}
          onClose={() => {
            setHasConnected(false)
            handleConnectionDecision(true)
          }}
        />
      ) : (
        <ConnectionDetails hostname={details.origin} handleDecision={handleDecision} />
      )}
    </Splash>
  )
}
