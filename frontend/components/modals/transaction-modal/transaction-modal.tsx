import { Button, Checkbox } from '@vegaprotocol/ui-toolkit'
import { useState } from 'react'
import ReactTimeAgo from 'react-time-ago'

import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '@/lib/client-rpc-methods'
import { TransactionMessage } from '@/lib/transactions'
import { useConnectionStore } from '@/stores/connections'
import { useInteractionStore } from '@/stores/interaction-store'

import { PageHeader } from '../../page-header'
import { Splash } from '../../splash'
import { EnrichedDetails } from './enriched-details'
import { RawTransaction } from './raw-transaction'
import { TransactionHeader } from './transaction-header'

export const locators = {
  transactionWrapper: 'transaction-wrapper',
  transactionTimeAgo: 'transaction-time-ago',
  transactionModalDenyButton: 'transaction-deny-button',
  transactionModalApproveButton: 'transaction-approve-button'
}

const TransactionModalFooter = ({
  handleTransactionDecision,
  details
}: {
  handleTransactionDecision: (decision: boolean) => void
  details: TransactionMessage
}) => {
  const { request } = useJsonRpcClient()
  const { connections } = useConnectionStore((state) => ({
    connections: state.connections
  }))
  const connection = connections.find((c) => c.origin === details?.origin)
  if (!connection) throw new Error(`Could not find connection with origin ${details.origin}`)
  const [autoConsent, setAutoConsent] = useState(connection.autoConsent)

  const handleDecision = async (decision: boolean) => {
    handleTransactionDecision(decision)
    if (connection && autoConsent !== connection.autoConsent) {
      await request(RpcMethods.UpdateConnection, {
        origin: connection.origin,
        autoConsent
      })
    }
  }

  return (
    <div className="fixed bottom-0 py-4 bg-black z-[15] px-5 border-t border-vega-dark-200 w-full">
      <div className="mt-2 grid grid-cols-[1fr_1fr] justify-between gap-4">
        <Button data-testid={locators.transactionModalDenyButton} onClick={() => handleDecision(false)}>
          Reject
        </Button>
        <Button
          data-testid={locators.transactionModalApproveButton}
          variant="primary"
          onClick={() => handleDecision(true)}
        >
          Confirm
        </Button>
      </div>
      <div>
        <Checkbox
          label={
            <span className="text-xs">
              Allow this site to automatically approve order and vote transactions. This can be turned off in
              "Connections".
            </span>
          }
          checked={autoConsent}
          onCheckedChange={() => {
            setAutoConsent(!autoConsent)
          }}
          name={'autoConsent'}
        />
      </div>
    </div>
  )
}

export const TransactionModal = () => {
  const { isOpen, handleTransactionDecision, details } = useInteractionStore((store) => ({
    isOpen: store.transactionModalOpen,
    handleTransactionDecision: store.handleTransactionDecision,
    details: store.currentTransactionDetails
  }))

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
          <EnrichedDetails transaction={details.transaction} />
          <RawTransaction transaction={details.transaction} />
          <div data-testid={locators.transactionTimeAgo} className="text-sm text-vega-dark-300 mt-6 mb-20">
            Received <ReactTimeAgo timeStyle="round" date={new Date(details.receivedAt)} locale="en-US" />
          </div>
        </section>
      </Splash>
      <TransactionModalFooter handleTransactionDecision={handleTransactionDecision} details={details} />
    </>
  )
}
