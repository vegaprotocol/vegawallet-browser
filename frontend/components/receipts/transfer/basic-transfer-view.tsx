import { AmountWithTooltip } from '../utils/string-amounts/amount-with-tooltip.tsx'
import { VegaKey } from '../../keys/vega-key'
import { ReceiptComponentProps } from '../receipts'

export const locators = {
  basicSection: 'basic-section'
}

export const BasicTransferView = ({ transaction }: ReceiptComponentProps) => {
  const { asset, amount } = transaction.transfer
  return (
    <div data-testid={locators.basicSection}>
      <div className="text-xl text-white">
        <AmountWithTooltip assetId={asset} amount={amount} />
      </div>
      <h1 className="text-vega-dark-300 mt-4">To</h1>
      <VegaKey publicKey={transaction.transfer.to} name="Receiving Key" />
    </div>
  )
}
