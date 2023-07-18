import { useCallback, useMemo } from 'react'
import { useModalStore } from '../../stores/modal-store'
import { Splash } from '../splash'
import { Button } from '@vegaprotocol/ui-toolkit'
import { PageHeader } from '../page-header'
import ReactTimeAgo from 'react-time-ago'
import { RawTransaction } from './raw-transaction'
import { TransactionHeader } from './transaction-header'

export const locators = {
  transactionWrapper: 'transaction-wrapper',
  transactionTimeAgo: 'transaction-time-ago',
  transactionModalDenyButton: 'transaction-deny-button',
  transactionModalApproveButton: 'transaction-approve-button'
}

export const TransactionModal = () => {
  const { isOpen, handleTransactionDecision, details } = useModalStore((store) => ({
    isOpen: store.transactionModalOpen,
    handleTransactionDecision: store.handleTransactionDecision,
    details: store.currentTransactionDetails
  }))
  const handleDecision = useCallback(
    (decision: boolean) => {
      handleTransactionDecision(decision)
    },
    [handleTransactionDecision]
  )

  const date = useMemo(() => {
    if (!details) return new Date()
    return new Date(details.receivedAt)
  }, [details])
  if (!isOpen || !details) return null
  return (
    <>
      <Splash data-testid={locators.transactionWrapper}>
        <PageHeader />
        <section className="pb-4 pt-2 px-5">
          <TransactionHeader
            origin={details.origin}
            publicKey={details.publicKey}
            name={details.name}
            transaction={details.transaction}
          />
          <RawTransaction transaction={details.transaction} />
          <div data-testid={locators.transactionTimeAgo} className="text-sm text-vega-dark-300 mt-6 mb-20">
            Received <ReactTimeAgo timeStyle="round" date={date} locale="en-US" />
          </div>
        </section>
      </Splash>
      <div className="fixed bottom-0 grid grid-cols-[1fr_1fr] justify-between gap-4 py-4 bg-black z-20 px-5 border-t border-vega-dark-200">
        <Button data-testid={locators.transactionModalDenyButton} onClick={() => handleDecision(false)}>
          Reject
        </Button>
        <Button
          data-testid={locators.transactionModalApproveButton}
          variant="primary"
          onClick={() => handleTransactionDecision(true)}
        >
          Confirm
        </Button>
      </div>
    </>
  )
}
