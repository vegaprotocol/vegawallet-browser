import { AmendmentView } from '../orders/amend'
import { CancellationView } from '../orders/cancellation'
import { SubmissionView } from '../orders/submission'
import { StopOrdersSubmissionView } from '../orders/stop-submission'
import { StopOrderCancellationView } from '../orders/stop-cancellation'

import { ReceiptComponentProps } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'
import { CollapsiblePanel } from '../../collapsible-panel'
import objectHash from 'object-hash'
import { Fragment } from 'react'
import { Notification, Intent } from '@vegaprotocol/ui-toolkit'

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
  command: string
  renderItem: (item: any, index: number) => JSX.Element
}) => {
  if (!items.length) return null
  return (
    <div className="last-of-type:mb-0 mb-4">
      <CollapsiblePanel
        title={command}
        panelContent={
          <>
            {/* TODO hash item to get key */}
            {items.map((s: any, i: number) => (
              <Fragment key={objectHash(s)}>
                <h2 data-testid={locators.header} className={'text-white mt-4'}>
                  {i + 1}.
                </h2>
                {renderItem(s, i)}
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
    cancellations,
    amendments,
    submissions,
    stopOrdersSubmission: stopOrdersSubmissions, // For some reason this is not plural in the command
    stopOrdersCancellation: stopOrdersCancellations // For some reason this is not plural in the command
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
        message="Batch market instructions contained no transactions. Please check the JSON and validate that this is the transaction you wish to send."
        intent={Intent.Warning}
      />
    )
  return (
    <ReceiptWrapper>
      <CommandSection
        items={cancellations}
        command="Cancellation"
        renderItem={(c) => <CancellationView cancellation={c} />}
      />
      <CommandSection items={amendments} command="Amendment" renderItem={(a) => <AmendmentView amendment={a} />} />
      <CommandSection
        items={submissions}
        command="Submission"
        renderItem={(s) => <SubmissionView orderSubmission={s} />}
      />
      <CommandSection
        items={stopOrdersCancellations}
        command="Stop Order Cancellation"
        renderItem={(c) => <StopOrderCancellationView stopOrdersCancellation={c} />}
      />
      <CommandSection
        items={stopOrdersSubmissions}
        command="Stop Order Submission"
        renderItem={(s) => <StopOrdersSubmissionView stopOrdersSubmission={s} />}
      />
    </ReceiptWrapper>
  )
}
