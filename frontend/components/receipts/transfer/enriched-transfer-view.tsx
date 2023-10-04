import { AmountWithSymbol } from '../utils/string-amounts/amount-with-symbol'
import { PriceWithSymbol } from '../utils/string-amounts/price-with-symbol'
import { VegaKey } from '../../keys/vega-key'
import { useWalletStore } from '../../../stores/wallets'
import { ReceiptComponentProps } from '../receipts'
import { useAssetsStore } from '../../../stores/assets-store'

export const locators = {
  enrichedSection: 'enriched-section'
}

export const EnrichedTransferView = ({ transaction }: ReceiptComponentProps) => {
  const { getAssetById } = useAssetsStore((state) => ({
    getAssetById: state.getAssetById
  }))
  const assetInfo = getAssetById(transaction.transfer.asset)
  const { getKeyById } = useWalletStore((state) => ({ getKeyById: state.getKeyById }))
  const { amount } = transaction.transfer
  const decimals = Number(assetInfo?.details?.decimals)
  const price = amount && decimals ? formatNumber(toBigNum(amount, decimals), decimals) : undefined
  const symbol = assetInfo?.details?.symbol
  const keyInfo = getKeyById(transaction.transfer.to)
  const isOwnKey = keyInfo?.publicKey === transaction.transfer.to

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
