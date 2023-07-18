import { Splash } from '../splash'
import { useState } from 'react'

import { useModalStore } from '../../stores/modal-store'
import locators from '../locators'
import { ConnectionSuccess } from './connection-success'
import { ConnectionDetails } from './connection-details'

export const ConnectionModal = () => {
  const { isOpen, handleConnectionDecision, details } = useModalStore((store) => ({
    isOpen: store.connectionModalOpen,
    handleConnectionDecision: store.handleConnectionDecision,
    details: store.currentConnectionDetails
  }))
  const [hasConnected, setHasConnected] = useState(false)
  const handleDecision = (decision: boolean) => {
    if (!decision) {
      handleConnectionDecision(decision)
    }
    setHasConnected(decision)
  }

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
