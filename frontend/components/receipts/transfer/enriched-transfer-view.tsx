import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { PriceWithSymbol } from '../utils/string-amounts/price-with-symbol.tsx'
import { VegaKey } from '../../keys/vega-key'
import { useWalletStore } from '../../../stores/wallets.ts'
import { ReceiptComponentProps } from '../receipts'
import { VegaAsset } from '../../../types/rest-api.ts'

export const locators = {
  enrichedSection: 'enriched-section'
}

interface EnrichedTransferViewProps extends ReceiptComponentProps {
  assetInfo: VegaAsset | undefined
}

export const EnrichedTransferView = ({ transaction, assetInfo }: EnrichedTransferViewProps) => {
  const { getKeyInfo } = useWalletStore((state) => ({ getKeyInfo: state.getKeyInfo }))
  const { amount } = transaction.transfer
  const decimals = Number(assetInfo?.details?.decimals)
  const price = amount && decimals ? formatNumber(toBigNum(amount, decimals), decimals) : undefined
  const symbol = assetInfo?.details?.symbol
  const keyInfo = getKeyInfo(transaction.transfer.to)

  return (
    <div data-testid={locators.enrichedSection}>
      <div className="text-xl text-white">
        {price && symbol ? <PriceWithSymbol price={price} symbol={symbol} /> : null}
      </div>
      <h1 className="text-vega-dark-300 mt-4">To</h1>
      <VegaKey
        publicKey={transaction.transfer.to}
        name={keyInfo.isOwnKey ? `${keyInfo.keyName} (own key)` : 'External key'}
      />
    </div>
  )
}
