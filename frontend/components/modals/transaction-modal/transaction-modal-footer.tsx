import { Button, Checkbox } from '@vegaprotocol/ui-toolkit'
import { useState } from 'react'

import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '@/lib/client-rpc-methods'
import { TransactionMessage } from '@/lib/transactions'
import { useConnectionStore } from '@/stores/connections'

export const locators = {
  transactionModalDenyButton: 'transaction-deny-button',
  transactionModalApproveButton: 'transaction-approve-button',
  transactionModalFooterAutoConsentSection: 'transaction-autoconsent-section'
}

export const TransactionModalFooter = ({
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
  const connection = connections.find((c) => c.origin === details.origin)
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
      {/* TODO should only show on transactions where autoConsent is possible */}
      {!autoConsent && (
        <div data-testid={locators.transactionModalFooterAutoConsentSection}>
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
      )}
    </div>
  )
}
