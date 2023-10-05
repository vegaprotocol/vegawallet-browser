import { ReactNode } from 'react'
import { EthereumKey } from '../../keys/ethereum-key'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const BaseWithdrawal = ({ children, receiverAddress }: { receiverAddress: string; children: ReactNode }) => {
  return (
    <ReceiptWrapper>
      {children}
      <EthereumKey address={receiverAddress} />
    </ReceiptWrapper>
  )
}
