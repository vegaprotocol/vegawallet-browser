import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { CopyWithCheckmark } from '../../copy-with-check'
import { KeyIcon } from '../../key-icon'
import ReactTimeAgo from 'react-time-ago'
import { isBefore } from 'date-fns'
import { ReceiptComponentProps } from '../receipts'
import { Transaction } from '../../../lib/transactions'

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
      <div className="flex text-lg mb-4" data-testid={locators.assetSymbol}>
        <div className="mr-2">0.0182199822</div>
        <div className="text-vega-dark-300">tDAI</div>
      </div>
      <h1 className="text-vega-dark-300">To</h1>
      <div className="flex items-center mb-4" data-testid={locators.receivingKeySection}>
        <KeyIcon publicKey={transaction.transfer.to} />
        <div className="ml-4">
          <div>Receiving Key</div>
          <p>
            <CopyWithCheckmark text={transaction.transfer.to}>
              <span className="underline text-vega-dark-400" data-testid={locators.publicKey}>
                {truncateMiddle(transaction.transfer.to)}
              </span>
            </CopyWithCheckmark>
          </p>
        </div>
      </div>
      <h1 className="text-vega-dark-300" data-testid={locators.whenSection}>
        When
      </h1>
      <p data-testid={locators.whenElement}>
        {time ? <ReactTimeAgo timeStyle="round" date={time} locale="en-US" /> : 'Now'}
      </p>
    </section>
  )
}
