import { Splash } from '../splash'
import { useCallback, useState } from 'react'

import { useModalStore } from '../../lib/modal-store'
import locators from '../locators'
import { ConnectionSuccess } from './connection-success'
import { ConnectionDetails } from './connection-details'

export const ConnectionModal = () => {
  const hostname = 'https://www.google.com'
  const { isOpen, setIsOpen } = useModalStore((store) => ({
    isOpen: store.connectionModalOpen,
    setIsOpen: store.setConnectionModalOpen
  }))
  const [hasConnected, setHasConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleDecision = useCallback((decision: boolean) => {
    if (decision) {
      setIsLoading(true)
      setHasConnected(true)
    }
  }, [])

  if (!isOpen) return null
  return (
    <Splash data-testid={locators.connectionModal}>
      {hasConnected ? (
        <ConnectionSuccess
          hostname={hostname}
          onClose={() => {
            setHasConnected(false)
            setIsOpen(false)
          }}
        />
      ) : (
        <ConnectionDetails hostname={hostname} isLoading={isLoading} handleDecision={handleDecision} />
      )}
    </Splash>
  )
}
