import { ReceiptComponentProps } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const ApplyReferralCode = ({ transaction }: ReceiptComponentProps) => {
  return (
    <ReceiptWrapper>
      <h1 className="text-vega-dark-300">Code</h1>
      <p>{transaction.referralCode.id}</p>
    </ReceiptWrapper>
  )
}
