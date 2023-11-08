import { AmountWithTooltip } from '../utils/string-amounts/amount-with-tooltip'
import { ReceiptComponentProps } from '../receipts'
import { Header } from '../../header'

export const locators = {
  basicSection: 'basic-section'
}

export const BasicTransferView = ({ transaction }: ReceiptComponentProps) => {
  const { asset, amount } = transaction.transfer
  return (
    <div data-testid={locators.basicSection}>
      <Header content={<AmountWithTooltip assetId={asset} amount={amount} />} />
    </div>
  )
}
