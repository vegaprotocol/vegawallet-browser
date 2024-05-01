import { Intent, Notification, Tooltip } from '@vegaprotocol/ui-toolkit'
import { useCallback, useEffect } from 'react'

import { LoaderBone } from '@/components/loader-bone'
import { VegaSection } from '@/components/vega-section'
import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { useAsyncAction } from '@/hooks/async-action'
import { Transaction } from '@/lib/transactions'
import { useInteractionStore } from '@/stores/interaction-store'
import { CheckTransactionResponse } from '@/types/backend'

export const locators = {}

const CheckTransactionResult = ({
  loading,
  data,
  error
}: {
  loading: boolean
  data: CheckTransactionResponse | null
  error: Error | null
}) => {
  if (error)
    return (
      <Notification
        intent={Intent.Danger}
        message={`There was an error checking your transactions validity. Error: ${error.message}`}
      />
    )
  if (loading || !data)
    return (
      <Notification
        intent={Intent.None}
        message={
          <div className="flex flex-row justify-between">
            <span className="mr-2">Checking transaction validity</span>
            <LoaderBone width={10} height={2} baseSize={8} />
          </div>
        }
      ></Notification>
    )
  if (data.valid)
    return (
      <Notification
        intent={Intent.Success}
        message={
          <Tooltip
            description={
              <div style={{ maxWidth: 300 }}>
                This transaction has passed all checks and is ready to be sent to the network. This is not a guarantee
                of success and may still be rejected if secondary checks on the network fail.
              </div>
            }
          >
            <span>Transaction is valid</span>
          </Tooltip>
        }
      />
    )
  return (
    <Notification
      intent={Intent.Danger}
      message={
        <Tooltip
          description={
            <div style={{ maxWidth: 300 }}>
              This error occurred when checking the transaction for validity, you can still send the transaction but it
              may be rejected.
            </div>
          }
        >
          <span>{data.error}</span>
        </Tooltip>
      }
    />
  )
}

export const CheckTransaction = ({
  transaction,
  publicKey,
  origin
}: {
  transaction: Transaction
  publicKey: string
  origin: string
}) => {
  const { request } = useJsonRpcClient()
  const { checkTransaction } = useInteractionStore((store) => ({
    checkTransaction: store.checkTransaction
  }))
  const checkTx = useCallback(
    () => checkTransaction(request, transaction, publicKey, origin),
    [checkTransaction, publicKey, request, transaction, origin]
  )
  const { loading, error, data, loaderFunction } = useAsyncAction(checkTx)
  useEffect(() => {
    loaderFunction()
  }, [loaderFunction])

  return (
    <VegaSection>
      <CheckTransactionResult loading={loading} data={data} error={error} />
    </VegaSection>
  )
}
