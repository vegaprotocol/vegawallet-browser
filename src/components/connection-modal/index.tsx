import { Button } from '@vegaprotocol/ui-toolkit'
import { Frame } from '../frame'
import { Tick } from '../icons/tick'
import { Splash } from '../splash'
import { ModalHeader } from '../modal-header'
import { useCallback, useState } from 'react'

import { useEffect } from 'react'
import { useModalStore } from '../../lib/modal-store'
import locators from '../locators'

type InteractionSuccessProps = {
  onClose: () => void
  hostname: string
}

const PixelatedTick = () => {
  return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16H0V20H4V16Z" fill="#161616" />
      <path d="M8 20H4V24H8V20Z" fill="#161616" />
      <path d="M12 24H8V28H12V24Z" fill="#161616" />
      <path d="M16 20H12V24H16V20Z" fill="#161616" />
      <path d="M20 16H16V20H20V16Z" fill="#161616" />
      <path d="M24 12H20V16H24V12Z" fill="#161616" />
      <path d="M28 8H24V12H28V8Z" fill="#161616" />
      <path d="M32 4H28V8H32V4Z" fill="#161616" />
      <path d="M36 0H32V4H36V0Z" fill="#161616" />
    </svg>
  )
}

export const ConnectionSuccess = ({ onClose, hostname }: InteractionSuccessProps) => {
  useEffect(() => {
    const stamp = setTimeout(() => {
      onClose()
    }, 1000)

    return () => clearTimeout(stamp)
  }, [onClose])

  return (
    <div
      data-testid={locators.connectionModalSuccess}
      className="w-full h-full flex flex-col py-24 px-5 justify-center items-center"
    >
      <div className="rounded-md py-5 px-4 bg-vega-green-550 mb-8">
        <PixelatedTick />
      </div>
      <h1 className="text-3xl text-center mb-1">Connected</h1>
      <h2 className="text-center text-vega-dark-400">{hostname}</h2>
    </div>
  )
}

const ConnectScreen = ({
  handleDecision,
  isLoading,
  hostname
}: {
  handleDecision: (decision: boolean) => void
  isLoading: boolean
  hostname: string
}) => {
  return (
    <div data-testid={locators.connectionModalApprove} className="px-5">
      <ModalHeader hostname={hostname} title="Connected to dApp" />
      <Frame>
        <p className="text-vega-dark-300 mb-3" data-testid={locators.connectionModalAccessListTitle}>
          Allow this site to:
        </p>
        <ul className="list-none">
          <li className="flex">
            <Tick className="w-3 mr-2 text-vega-green-550" />
            <p data-testid={locators.connectionModalAccessListAccess} className="text-light-200">
              See all of your wallet’s public keys
            </p>
          </li>
          <li className="flex">
            <Tick className="w-3 mr-2 text-vega-green-550" />
            <p data-testid={locators.connectionModalAccessListAccess} className="text-light-200">
              Send transaction requests for you to sign
            </p>
          </li>
        </ul>
      </Frame>
      <div className="grid grid-cols-[1fr_1fr] justify-between gap-4 mt-5">
        <Button
          data-testid={locators.connectionModalDenyButton}
          disabled={!!isLoading}
          onClick={() => handleDecision(false)}
        >
          Deny
        </Button>
        <Button
          data-testid={locators.connectionModalApproveButton}
          variant="primary"
          disabled={!!isLoading}
          onClick={() => handleDecision(true)}
        >
          Approve
        </Button>
      </div>
    </div>
  )
}

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
        <ConnectScreen hostname={hostname} isLoading={isLoading} handleDecision={handleDecision} />
      )}
    </Splash>
  )
}
