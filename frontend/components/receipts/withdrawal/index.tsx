import { EthereumKey } from '../../keys/ethereum-key'
import { ReceiptComponentProps } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const locators = {
  whenSection: 'when-section',
  whenElement: 'when-element'
}

export const Withdraw = ({ transaction }: ReceiptComponentProps) => {
  if (!transaction.withdrawSubmission.ext.erc20) return null
  return (
    <ReceiptWrapper type="Withdrawal">
      <EthereumKey address={transaction.withdrawSubmission.ext.erc20.receiverAddress} />
    </ReceiptWrapper>
  )
}
