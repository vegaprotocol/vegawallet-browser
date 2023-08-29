import ReactTimeAgo from 'react-time-ago'
import { isBefore } from 'date-fns'
import { ReceiptComponentProps } from '../receipts'
import { Transaction } from '../../../lib/transactions'
import { VegaKey } from '../../keys/vega-key'
import { getDateTimeFormat } from '@vegaprotocol/utils'
import { AmountWithTooltip } from '../utils/amount-with-tooltip'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

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
  whenElement: 'when-element'
}

export const Transfer = ({ transaction }: ReceiptComponentProps) => {
  // Not supporting recurring transfers yet
  if (transaction.transfer.recurring) return null
  const time = getTime(transaction)
  const { asset, amount } = transaction.transfer
  return (
    <ReceiptWrapper>
      <h1 className="text-vega-dark-300 mt-4">To</h1>
      <VegaKey publicKey={transaction.transfer.to} name="Receiving Key" />
        <div className="text-2xl text-white">
          <AmountWithTooltip assetId={asset} amount={amount} />
        </div>
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
