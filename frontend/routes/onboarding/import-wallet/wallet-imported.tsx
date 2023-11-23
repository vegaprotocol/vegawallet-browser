import { useEffect } from 'react'
import { SuccessTick } from '../../../components/icons/success-tick'
import { StarsWrapper } from '../../../components/stars-wrapper'
import { Header } from '../../../components/header'

export const locators = {
  walletImported: 'wallet-imported'
}

export interface WalletImportedProperties {
  onClose: () => void
}

export const WalletImported = ({ onClose }: WalletImportedProperties) => {
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
        <Header content="Wallet imported" />
      </div>
    </StarsWrapper>
  )
}
