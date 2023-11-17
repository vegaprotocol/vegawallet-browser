import { AmountWithSymbol } from '../utils/string-amounts/amount-with-symbol'
import { ReceiptComponentProps } from '../receipts'
import { useFormatAssetAmount } from '../../../hooks/format-asset-amount'
import { Header } from '../../header'

export const locators = {
  enrichedSection: 'enriched-section'
}

export const EnrichedTransferView = ({ transaction }: ReceiptComponentProps) => {
  const { amount } = transaction.transfer
  const { formattedAmount, symbol } = useFormatAssetAmount(transaction.transfer.asset, amount)
  if (!formattedAmount || !symbol) return null

  return (
    <div data-testid={locators.enrichedSection}>
      <Header content={<AmountWithSymbol amount={formattedAmount} symbol={symbol} />} />
    </div>
  )
}
