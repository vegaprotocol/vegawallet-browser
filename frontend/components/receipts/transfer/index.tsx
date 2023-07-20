import ReactTimeAgo from 'react-time-ago'
import { isBefore } from 'date-fns'
import { ReceiptComponentProps } from '../receipts'
import { Transaction } from '../../../lib/transactions'
import { PriceWithSymbol } from '../utils/price-with-symbol'
import { VegaKey } from '../../keys/vega-key'

const getTime = (transaction: Transaction) => {
  const deliverOn = transaction?.transfer?.oneOff?.deliverOn
  if (deliverOn) {
    const date = new Date(deliverOn)
    if (isBefore(date, new Date())) return null
    return date
  }
  return null
}

export const locators = {
  transferSection: 'transfer-section',
  transferTitle: 'transfer-title',
  assetSymbol: 'asset-symbol',
  assetAmount: 'asset-amount',
  receivingKeySection: 'receiving-key-section',
  publicKey: 'public-key',
  whenSection: 'when-section',
  whenElement: 'when-element'
}

export const Transfer = ({ transaction }: ReceiptComponentProps) => {
  // Not supporting recurring transfers yet
  if (transaction.transfer.recurring) return null
  const time = getTime(transaction)
  return (
    <section data-testid={locators.transferSection}>
      <h1 className="text-vega-dark-300" data-testid={locators.transferTitle}>
        Transfer
      </h1>
      <div className="text-lg">
        <PriceWithSymbol price={0.0182199822} symbol="tDAI" />
      </div>
      <h1 className="text-vega-dark-300">To</h1>
      <VegaKey publicKey={transaction.transfer.to} name="Receiving Key" />
      <h1 className="text-vega-dark-300" data-testid={locators.whenSection}>
        When
      </h1>
      <p data-testid={locators.whenElement}>
        {time ? <ReactTimeAgo timeStyle="round" date={time} locale="en-US" /> : 'Now'}
      </p>
    </section>
  )
}
