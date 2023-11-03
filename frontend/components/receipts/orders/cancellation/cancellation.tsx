import { ReceiptComponentProps } from '../../receipts'
import { useEffect } from 'react'
import { useOrdersStore } from '../../../../stores/orders-store'
import { useJsonRpcClient } from '../../../../contexts/json-rpc/json-rpc-context'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'
import { CancellationView } from './cancellation-view'

// TODO pass error to receipt view after error handling PR is merged
export const Cancellation = ({ transaction }: ReceiptComponentProps) => {
  const { getOrderById, lastUpdated, order } = useOrdersStore((state) => ({
    getOrderById: state.getOrderById,
    lastUpdated: state.lastUpdated,
    order: state.order
  }))
  const cancellation = transaction.orderCancellation
  const { orderId } = cancellation
  const { request } = useJsonRpcClient()

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId, request)
    }
  }, [orderId, getOrderById, request])

  return (
    <ReceiptWrapper>
      <CancellationView cancellation={cancellation} order={order} />
      {order && lastUpdated && (
        <div className="text-sm text-gray-500 mt-2">Last Updated: {new Date(lastUpdated).toLocaleString()}</div>
      )}
    </ReceiptWrapper>
  )
}
