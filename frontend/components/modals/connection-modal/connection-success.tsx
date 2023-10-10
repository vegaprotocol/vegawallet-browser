import { useEffect } from 'react'
import locators from '../../locators'
import { SuccessTick } from '../../icons/success-tick'
import { Header } from '../../header'

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
      <Header content="Connected" />
      <h2 data-testid={locators.connectionSuccessHostname} className="mt-1 break-all text-center text-vega-dark-400">
        {hostname}
      </h2>
    </div>
  )
}
