import { useEffect } from 'react'
import locators from '../locators'

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
      className="w-full h-full flex flex-col py-24 px-5 justify-center items-center"
    >
      <div className="rounded-md py-5 px-4 bg-vega-green-550 mb-8">
        <PixelatedTick />
      </div>
      <h1 data-testid={locators.connectionSuccessTitle} className="text-3xl text-center mb-1">
        Connected
      </h1>
      <h2 data-testid={locators.connectionSuccessHostname} className="text-center text-vega-dark-400">
        {hostname}
      </h2>
    </div>
  )
}
