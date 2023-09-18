import ReactTimeAgo from 'react-time-ago'
import { isBefore } from 'date-fns'
import { ReceiptComponentProps } from '../receipts'
import { Transaction } from '../../../lib/transactions'
import { VegaKey } from '../../keys/vega-key'
import { getDateTimeFormat } from '@vegaprotocol/utils'
import { AmountWithTooltip } from '../utils/string-amounts/amount-with-tooltip'
import { PriceWithSymbol } from '../utils/string-amounts/price-with-symbol.tsx'
import { ReceiptWrapper } from '../utils/receipt-wrapper'
import { useAssetsStore } from '../../../stores/assets-store.ts'
import { useWalletStore, Wallet } from '../../../stores/wallets.ts'
import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import type { Asset } from '../../../stores/assets-store.ts'

const getTime = (transaction: Transaction) => {
  const deliverOn = transaction.transfer.oneOff?.deliverOn
  if (deliverOn) {
    const deliverOnInSeconds = Math.floor(deliverOn / 1000)
    const date = new Date(deliverOnInSeconds)
    if (isBefore(date, new Date())) return null
    return date
  }
  return null
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

export const locators = {
  whenSection: 'when-section',
  whenElement: 'when-element',
  basicSection: 'basic-section',
  enrichedSection: 'enriched-section',
  loading: 'loading'
}

export const Transfer = ({ transaction }: ReceiptComponentProps) => {
  const { loading: assetsLoading, getAssetById } = useAssetsStore()
  const { wallets, loading: walletsLoading } = useWalletStore()
  // Not supporting recurring transfers yet
  if (transaction.transfer.recurring) return null
  const time = getTime(transaction)
  const { asset, amount } = transaction.transfer
  let assetInfo: Asset | undefined
  let error: Error | null = null
  try {
    assetInfo = getAssetById(asset)
  } catch (err) {
    error = err as Error
  }

  const BasicTransferView = () => (
    <div data-testid={locators.basicSection}>
      <div className="text-xl text-white">
        <AmountWithTooltip assetId={asset} amount={amount} />
      </div>
      <h1 className="text-vega-dark-300 mt-4">To</h1>
      <VegaKey publicKey={transaction.transfer.to} name="Receiving Key" />
    </div>
  )

  const EnrichedTransferView = () => {
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

  return (
    <ReceiptWrapper>
      <h1 className="text-vega-dark-300">Amount</h1>

      {assetsLoading || walletsLoading ? (
        <div data-testid={locators.loading}>Loading...</div>
      ) : error ? (
        <BasicTransferView />
      ) : (
        <EnrichedTransferView />
      )}

      <h1 className="text-vega-dark-300 mt-4" data-testid={locators.whenSection}>
        When
      </h1>
      <p data-testid={locators.whenElement}>
        {time ? (
          <>
            <ReactTimeAgo timeStyle="round" date={time} locale="en-US" /> ({getDateTimeFormat().format(new Date(time))})
          </>
        ) : (
          'Now'
        )}
      </p>
    </ReceiptWrapper>
  )
}
