import ReactTimeAgo from 'react-time-ago'
import { useEffect, useState } from 'react'
import { isBefore } from 'date-fns'
import { ReceiptComponentProps } from '../receipts'
import { Transaction } from '../../../lib/transactions'
import { BasicTransferView } from './basic-transfer-view.tsx'
import { EnrichedTransferView } from './enriched-transfer-view.tsx'
import { getDateTimeFormat } from '@vegaprotocol/utils'
import { ReceiptWrapper } from '../utils/receipt-wrapper'
import { useAssetsStore } from '../../../stores/assets-store.ts'
import { useWalletStore } from '../../../stores/wallets.ts'
import { VegaAsset } from '../../../types/rest-api.ts'

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

export const locators = {
  whenSection: 'when-section',
  whenElement: 'when-element',
  loading: 'loading'
}

export const Transfer = ({ transaction }: ReceiptComponentProps) => {
  const { loading: assetsLoading, assets, getAssetById } = useAssetsStore()
  const { wallets, loading: walletsLoading } = useWalletStore()
  const { asset } = transaction.transfer
  const [assetInfo, setAssetInfo] = useState<VegaAsset | null>(null)

  useEffect(() => {
    if (assets.length > 0) {
      const res = getAssetById(asset)
      if (res.id) {
        setAssetInfo(res)
      }
    }
  }, [assets, asset])

  // Not supporting recurring transfers yet
  if (transaction.transfer.recurring) return null
  const time = getTime(transaction)

  return (
    <ReceiptWrapper>
      <h1 className="text-vega-dark-300">Amount</h1>

      {assetsLoading || walletsLoading || !assetInfo ? (
        <BasicTransferView transaction={transaction} />
      ) : (
        <EnrichedTransferView transaction={transaction} assetInfo={assetInfo} wallets={wallets} />
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
