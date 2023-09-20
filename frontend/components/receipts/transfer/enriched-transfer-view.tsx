import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { PriceWithSymbol } from '../utils/string-amounts/price-with-symbol.tsx'
import { VegaKey } from '../../keys/vega-key'
import { Wallet } from '../../../stores/wallets.ts'
import { ReceiptComponentProps } from '../receipts'
import { VegaAsset } from '../../../types/rest-api.ts'

export const locators = {
  enrichedSection: 'enriched-section'
}

interface EnrichedTransferViewProps extends ReceiptComponentProps {
  assetInfo: VegaAsset | undefined
  wallets: Wallet[]
}

export const getKeyInfo = (
  userWallets: Wallet[],
  targetPublicKey: string
): {
  isSelfTransfer: boolean
  keyName: string | undefined
} => {
  for (const wallet of userWallets) {
    for (const key of wallet.keys) {
      if (key.publicKey === targetPublicKey) {
        return {
          isSelfTransfer: true,
          keyName: key.name
        }
      }
    }
  }
  return {
    isSelfTransfer: false,
    keyName: undefined
  }
}

export const EnrichedTransferView = ({ transaction, assetInfo, wallets }: EnrichedTransferViewProps) => {
  const { amount } = transaction.transfer
  const decimals = Number(assetInfo?.details?.decimals)
  const price = amount && decimals ? formatNumber(toBigNum(amount, decimals), decimals) : undefined
  const symbol = assetInfo?.details?.symbol
  const keyInfo = getKeyInfo(wallets, transaction.transfer.to)

  return (
    // We can safely assume we have the data for this section, if we didn't we'd be in the
    // error state and the BasicTransferView would be rendered instead.
    <div data-testid={locators.enrichedSection}>
      <div className="text-xl text-white">
        {price && symbol ? <PriceWithSymbol price={price} symbol={symbol} /> : null}
      </div>
      <h1 className="text-vega-dark-300 mt-4">To</h1>
      <VegaKey
        publicKey={transaction.transfer.to}
        name={keyInfo.isSelfTransfer ? `${keyInfo.keyName} (own key)` : 'External key'}
      />
    </div>
  )
}
