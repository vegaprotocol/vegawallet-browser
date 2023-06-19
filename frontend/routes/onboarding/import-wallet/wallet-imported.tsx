import { useEffect } from 'react'
import { SuccessTick } from '../../../components/icons/success-tick'
import { StarsWrapper } from '../../../components/stars-wrapper'

export const locators = {
  walletImported: 'wallet-imported',
  title: 'wallet-imported-title'
}

export interface WalletImportedProps {
  onClose: () => void
}

export const WalletImported = ({ onClose }: WalletImportedProps) => {
  useEffect(() => {
    const stamp = setTimeout(() => {
      onClose()
    }, 1000)

    return () => clearTimeout(stamp)
  }, [onClose])

  return (
    <StarsWrapper>
      <div
        data-testid={locators.walletImported}
        className="w-full h-full flex flex-col py-24 justify-center items-center"
      >
        <SuccessTick />
        <h1 data-testid={locators.title} className="text-2xl text-center text-white mb-1">
          Wallet imported.
        </h1>
      </div>
    </StarsWrapper>
  )
}
