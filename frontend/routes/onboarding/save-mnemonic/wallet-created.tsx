import { useEffect } from 'react'
import { SuccessTick } from '../../../components/icons/success-tick'
import { StarsWrapper } from '../../../components/stars-wrapper'
import { Header } from '../../../components/header'

export const locators = {
  walletCreated: 'wallet-created'
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
        <Header content="Your new wallet is ready" />
      </div>
    </StarsWrapper>
  )
}
