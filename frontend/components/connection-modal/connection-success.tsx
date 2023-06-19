import { useEffect } from 'react'
import locators from '../locators'
import { SuccessTick } from '../icons/success-tick'

export interface ConnectionSuccessProps {
  onClose: () => void
  hostname: string
}

export const ConnectionSuccess = ({ onClose, hostname }: ConnectionSuccessProps) => {
  useEffect(() => {
    const stamp = setTimeout(() => {
      onClose()
    }, 1000)

    return () => clearTimeout(stamp)
  }, [onClose])

  return (
    <div
      data-testid={locators.connectionModalSuccess}
      className="w-full h-full flex flex-col py-24 justify-center items-center"
    >
      <SuccessTick />
      <h1 data-testid={locators.connectionSuccessTitle} className="text-2xl text-center text-white mb-1">
        Connected
      </h1>
      <h2 data-testid={locators.connectionSuccessHostname} className="break-all text-center text-vega-dark-400">
        {hostname}
      </h2>
    </div>
  )
}
