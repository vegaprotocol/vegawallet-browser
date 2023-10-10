import { AmountWithTooltip } from '../utils/string-amounts/amount-with-tooltip'
import { VegaKey } from '../../keys/vega-key'
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
      <h1 className="text-vega-dark-300 mt-4">To</h1>
      <VegaKey publicKey={transaction.transfer.to} name="Receiving Key" />
    </div>
  )
}
