import { AmountWithSymbol } from '../utils/string-amounts/amount-with-symbol'
import { VegaKey } from '../../keys/vega-key'
import { useWalletStore } from '../../../stores/wallets'
import { ReceiptComponentProps } from '../receipts'
import { useFormatAssetAmount } from '../../../hooks/format-asset-amount'

export const locators = {
  enrichedSection: 'enriched-section'
}

export const EnrichedTransferView = ({ transaction }: ReceiptComponentProps) => {
  const { amount } = transaction.transfer
  const { formattedAmount, symbol } = useFormatAssetAmount(transaction.transfer.asset, amount)
  const { getKeyById } = useWalletStore((state) => ({ getKeyById: state.getKeyById }))
  const keyInfo = getKeyById(transaction.transfer.to)
  const isOwnKey = !!keyInfo

  return (
    <div data-testid={locators.enrichedSection}>
      <div className="text-xl text-white">
        <AmountWithSymbol amount={formattedAmount} symbol={symbol} />
      </div>
      <h1 className="text-vega-dark-300 mt-4">To</h1>
      <VegaKey publicKey={transaction.transfer.to} name={isOwnKey ? `${keyInfo?.name} (own key)` : 'External key'} />
    </div>
  )
}
