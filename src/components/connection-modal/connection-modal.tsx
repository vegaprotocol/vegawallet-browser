import { Splash } from '../splash'
import { useCallback, useState } from 'react'

import { useModalStore } from '../../lib/modal-store'
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
  const handleDecision = useCallback(
    (decision: boolean) => {
      if (!decision) {
        handleConnectionDecision(decision)
      }
      setHasConnected(decision)
    },
    [handleConnectionDecision]
  )

  if (!isOpen) return null
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
