import { AmountWithSymbol } from '../utils/string-amounts/amount-with-symbol'
import { VegaKey } from '../../keys/vega-key'
import { useWalletStore } from '../../../stores/wallets'
import { ReceiptComponentProps } from '../receipts'
import { useFormatAssetAmount } from '../../../hooks/format-asset-amount'
import { Header } from '../../header'
import { BaseTransferView } from './base-transfer-view'

export const locators = {
  enrichedSection: 'enriched-section'
}

export const EnrichedTransferView = ({ transaction }: ReceiptComponentProps) => {
  const { amount } = transaction.transfer
  const { formattedAmount, symbol } = useFormatAssetAmount(transaction.transfer.asset, amount)

  // TODO we should assume that wallets are always loaded by the time we render the enriched view.
  // not having it makes it impossible to do anything anyway.
  return (
    <BaseTransferView transaction={transaction}>
      <div data-testid={locators.enrichedSection}>
        <Header content={<AmountWithSymbol amount={formattedAmount} symbol={symbol} />} />
      </div>
    </BaseTransferView>
  )
}
