import { AmountWithTooltip } from '../utils/string-amounts/amount-with-tooltip'
import { ReceiptComponentProps } from '../receipts'
import { BaseTransferView } from './base-transfer-view'
import { Header } from '../../header'

export const locators = {
  basicSection: 'basic-section'
}

export const BasicTransferView = ({ transaction }: ReceiptComponentProps) => {
  const { asset, amount } = transaction.transfer
  return (
    <BaseTransferView transaction={transaction}>
      <Header content={<AmountWithTooltip assetId={asset} amount={amount} />} />
    </BaseTransferView>
  )
}
