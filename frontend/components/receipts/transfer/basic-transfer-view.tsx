import { AmountWithTooltip } from '../utils/string-amounts/amount-with-tooltip'
import { ReceiptComponentProps } from '../receipts'
import { BaseTransferView } from './base-transfer-view'

export const locators = {
  basicTransferView: 'basic-transfer-view'
}

export const BasicTransferView = ({ transaction }: ReceiptComponentProps) => {
  const { asset, amount } = transaction.transfer
  return (
    <BaseTransferView transaction={transaction}>
      <div className="text-xl text-white">
        <AmountWithTooltip assetId={asset} amount={amount} />
      </div>
    </BaseTransferView>
  )
}
