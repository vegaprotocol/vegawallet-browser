import { useEffect } from 'react'
import { SuccessTick } from '../../../components/icons/success-tick'
import { StarsWrapper } from '../../../components/stars-wrapper'

export const locators = {
  walletCreated: 'wallet-created',
  title: 'wallet-created-title'
}

export interface WalletCreatedProps {
  onClose: () => void
}

export const WalletCreated = ({ onClose }: WalletCreatedProps) => {
  useEffect(() => {
    const stamp = setTimeout(() => {
      onClose()
    }, 1000)

    return () => clearTimeout(stamp)
  }, [onClose])
  return (
    <StarsWrapper>
      <div
        data-testid={locators.walletCreated}
        className="w-full h-full flex flex-col py-24 justify-center items-center"
      >
        <SuccessTick />
        <h1 data-testid={locators.title} className="text-3xl text-center mb-1">
          Your new wallet is ready.
        </h1>
      </div>
    </StarsWrapper>
  )
}
