import { ReceiptComponentProps } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const locators = {
  referralCodeTitle: 'referral-code-title',
  referralCode: 'referral-code'
}

export const ApplyReferralCode = ({ transaction }: ReceiptComponentProps) => {
  return (
    <ReceiptWrapper>
      <h1 className="text-vega-dark-300" data-testid={locators.referralCodeTitle}>
        Code
      </h1>
      <p data-testid={locators.referralCode}>{transaction.applyReferralCode.id}</p>
    </ReceiptWrapper>
  )
}
