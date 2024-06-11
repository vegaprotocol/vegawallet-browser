import { Button, Checkbox } from '@vegaprotocol/ui-toolkit'
import { useState } from 'react'

import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '@/lib/client-rpc-methods'
import { getTransactionType, type TransactionMessage } from '@/lib/transactions'
import { useConnectionStore } from '@/stores/connections'

import { AUTO_CONSENT_TRANSACTION_TYPES } from '../../../../lib/constants'

export const locators = {
  transactionModalDenyButton: 'transaction-deny-button',
  transactionModalApproveButton: 'transaction-approve-button',
  transactionModalFooterAutoConsentSection: 'transaction-autoconsent-section',
  transactionModalFooterTransactionQueue: 'transaction-queue'
}

const AutoConsentOptIn = ({
  autoConsent,
  setAutoConsent
}: {
  autoConsent: boolean
  setAutoConsent: (autoConsent: boolean) => void
}) => {
  return (
    <div className="mt-2" data-testid={locators.transactionModalFooterAutoConsentSection}>
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
  )
}

const TransactionQueueNotifier = ({ transactionCount }: { transactionCount: number }) => {
  return (
    <div data-testid={locators.transactionModalFooterTransactionQueue} className="mb-2 text-xs text-vega-dark-400">
      There are {transactionCount} transactions currently in the queue
    </div>
  )
}

export const TransactionModalFooter = ({
  handleTransactionDecision,
  details,
  transactionCount
}: {
  handleTransactionDecision: (decision: boolean) => void
  details: TransactionMessage
  transactionCount: number
}) => {
  const { request } = useJsonRpcClient()
  const { connections, loadConnections } = useConnectionStore((state) => ({
    connections: state.connections,
    loadConnections: state.loadConnections
  }))
  const connection = connections.find((c) => c.origin === details.origin)
  if (!connection) throw new Error(`Could not find connection with origin ${details.origin}`)
  const [autoConsent, setAutoConsent] = useState(connection.autoConsent)

  const handleDecision = async (decision: boolean) => {
    handleTransactionDecision(decision)
    if (connection && autoConsent !== connection.autoConsent) {
      await request(RpcMethods.UpdateAutomaticConsent, {
        origin: connection.origin,
        autoConsent
      })
      await loadConnections(request)
    }
  }
  const showAutoConsent =
    !connection.autoConsent && AUTO_CONSENT_TRANSACTION_TYPES.includes(getTransactionType(details.transaction))
  const hasTransactionQueue = transactionCount > 1

  return (
    <div className="py-4 bg-black z-[15] px-5 border-t border-vega-dark-200 w-full">
      {hasTransactionQueue && <TransactionQueueNotifier transactionCount={transactionCount} />}
      <div className="grid grid-cols-[1fr_1fr] justify-between gap-4">
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
      {/* Do not show auto consent opt in when there are multiple pending transactions, to avoid crowding the UI */}
      {showAutoConsent && !hasTransactionQueue && (
        <AutoConsentOptIn autoConsent={autoConsent} setAutoConsent={setAutoConsent} />
      )}
    </div>
  )
}
