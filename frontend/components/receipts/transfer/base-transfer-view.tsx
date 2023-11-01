import { ReactNode } from 'react'
import { ReceiptComponentProps } from '../receipts'
import ReactTimeAgo from 'react-time-ago'
import { formatDate, nanoSecondsToMilliseconds } from '../../../lib/utils'
import { Transaction } from '../../../lib/transactions'
import { isBefore } from 'date-fns'
import { VegaKey } from '../../keys/vega-key'
import { useWalletStore } from '../../../stores/wallets'
import { ReceiptWrapper } from '../utils/receipt-wrapper'
import { SubHeader } from '../../sub-header'

export const locators = {
  whenSection: 'when-section',
  whenElement: 'when-element'
}

const getTime = (transaction: Transaction) => {
  const deliverOn = transaction.transfer.oneOff?.deliverOn
  if (deliverOn) {
    const date = nanoSecondsToMilliseconds(deliverOn)
    if (isBefore(date, new Date())) return null
    return date
  }
  return null
}

export const BaseTransferView = ({ transaction, children }: { children: ReactNode } & ReceiptComponentProps) => {
  const time = getTime(transaction)
  const { getKeyById } = useWalletStore((state) => ({ getKeyById: state.getKeyById }))
  const keyInfo = getKeyById(transaction.transfer.to)
  const isOwnKey = keyInfo?.publicKey === transaction.transfer.to

  return (
    <ReceiptWrapper>
      <SubHeader content="Amount" />
      {children}

      <SubHeader content="To" className="mt-4" />
      <VegaKey publicKey={transaction.transfer.to} name={isOwnKey ? `${keyInfo?.name} (own key)` : 'External key'} />

      <SubHeader content="When" className="mt-4" />
      <p data-testid={locators.whenElement}>
        {time ? (
          <>
            <ReactTimeAgo timeStyle="round" date={time} locale="en-US" /> ({formatDate(time)})
          </>
        ) : (
          'Now'
        )}
      </p>
    </ReceiptWrapper>
  )
}
