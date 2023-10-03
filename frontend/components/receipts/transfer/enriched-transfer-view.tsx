import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { PriceWithSymbol } from '../utils/string-amounts/price-with-symbol'
import { ReceiptComponentProps } from '../receipts'
import { useAssetsStore } from '../../../stores/assets-store'
import { BaseTransferView } from './base-transfer-view'

export const locators = {
  enrichedSection: 'enriched-section'
}

export const EnrichedTransferView = ({ transaction }: ReceiptComponentProps) => {
  const { getAssetById } = useAssetsStore((state) => ({
    getAssetById: state.getAssetById
  }))
  const assetInfo = getAssetById(transaction.transfer.asset)
  const { amount } = transaction.transfer
  const decimals = Number(assetInfo?.details?.decimals)
  const formattedAmount = amount && decimals ? formatNumber(toBigNum(amount, decimals), decimals) : undefined
  const symbol = assetInfo?.details?.symbol

  return (
    <BaseTransferView transaction={transaction}>
      <div data-testid={locators.enrichedSection}>
        <div className="text-xl text-white">
          {formattedAmount && symbol ? <PriceWithSymbol price={formattedAmount} symbol={symbol} /> : null}
        </div>
      </div>
    </BaseTransferView>
  )
}
