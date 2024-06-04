import type { ReactNode } from 'react'

import { EthereumKey } from '@/components/keys/ethereum-key'

import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const ReceivingKey = ({ assetId, address }: { address: string; assetId: string }) => {
  return <EthereumKey address={address} />
}

export const BaseWithdrawal = ({
  children,
  receiverAddress,
  assetId
}: {
  receiverAddress: string
  children: ReactNode
  assetId: string
}) => {
  return (
    <ReceiptWrapper>
      {children}
      <ReceivingKey address={receiverAddress} assetId={assetId} />
    </ReceiptWrapper>
  )
}
