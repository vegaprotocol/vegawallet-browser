import { AmendmentView } from '../orders/amend'
import { SubmissionView } from '../orders/submission'
import { StopOrdersSubmissionView } from '../orders/stop-submission'
import { StopOrderCancellationView } from '../orders/stop-cancellation'

import { ReceiptComponentProps } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'
import { CollapsiblePanel } from '../../collapsible-panel'
import objectHash from 'object-hash'
import { Fragment } from 'react'
import { Notification, Intent } from '@vegaprotocol/ui-toolkit'
import { CancellationView } from '../orders/cancellation/cancellation-view'
import { getBatchTitle } from '../../modals/transaction-modal/get-title'
import { BatchTransactionCommands, TransactionKeys } from '../../../lib/transactions'

const BATCH_COMMAND_TITLE_MAP: Record<BatchTransactionCommands, string> = {
  [TransactionKeys.ORDER_SUBMISSION]: 'Submissions',
  [TransactionKeys.ORDER_CANCELLATION]: 'Cancellations',
  [TransactionKeys.ORDER_AMENDMENT]: 'Amendments',
  [TransactionKeys.STOP_ORDERS_SUBMISSION]: 'Stop Order Cancellations',
  [TransactionKeys.STOP_ORDERS_CANCELLATION]: 'Stop Order Submissions'
}

export const locators = {
  header: 'header',
  cancellations: 'cancellations',
  amendments: 'amendments',
  submissions: 'submissions',
  stopOrderSubmissions: 'stop-order-submissions',
  stopOrderCancellations: 'stop-order-cancellations',
  noTransactionsNotification: 'no-transactions-notification'
}

const CommandSection = ({
  items,
  command,
  renderItem
}: {
  items: any[]
  command: BatchTransactionCommands
  renderItem: (item: any, index: number) => JSX.Element
}) => {
  if (!items.length) return null
  return (
    <div className="last-of-type:mb-0 mb-4">
      <CollapsiblePanel
        title={BATCH_COMMAND_TITLE_MAP[command]}
        initiallyOpen={true}
        panelContent={
          <>
            {items.map((item: any, i: number) => (
              <Fragment key={objectHash(item)}>
                <h2 data-testid={locators.header} className={'text-white mt-4'}>
                  {i + 1}. {getBatchTitle(command, item)}
                </h2>
                {renderItem(item, i)}
              </Fragment>
            ))}
          </>
        }
      />
    </div>
  )
}

export const BatchMarketInstructions = ({ transaction }: ReceiptComponentProps) => {
  const { batchMarketInstructions } = transaction
  const {
    cancellations = [],
    amendments = [],
    submissions = [],
    stopOrdersSubmission: stopOrdersSubmissions = [], // For some reason this is not plural in the command
    stopOrdersCancellation: stopOrdersCancellations = [] // For some reason this is not plural in the command
  } = batchMarketInstructions

  if (
    [
      ...cancellations,
      ...amendments,
      ...submissions,
      ...stopOrdersSubmissions, // For some reason this is not plural in the command
      ...stopOrdersCancellations
    ].length === 0
  )
    return (
      <Notification
        testId={locators.noTransactionsNotification}
        message="Batch market instructions did not contain any transactions. Please view the raw transaction and check this is the transaction you wish to send."
        intent={Intent.Warning}
      />
    )
  return (
    <ReceiptWrapper>
      <CommandSection
        items={cancellations}
        command={TransactionKeys.ORDER_CANCELLATION}
        renderItem={(c) => <CancellationView cancellation={c} />}
      />
      <CommandSection
        items={amendments}
        command={TransactionKeys.ORDER_AMENDMENT}
        renderItem={(a) => <AmendmentView amendment={a} />}
      />
      <CommandSection
        items={submissions}
        command={TransactionKeys.ORDER_SUBMISSION}
        renderItem={(s) => <SubmissionView orderSubmission={s} />}
      />
      <CommandSection
        items={stopOrdersCancellations}
        command={TransactionKeys.STOP_ORDERS_CANCELLATION}
        renderItem={(c) => <StopOrderCancellationView stopOrdersCancellation={c} />}
      />
      <CommandSection
        items={stopOrdersSubmissions}
        command={TransactionKeys.STOP_ORDERS_SUBMISSION}
        renderItem={(s) => <StopOrdersSubmissionView stopOrdersSubmission={s} />}
      />
    </ReceiptWrapper>
  )
}
