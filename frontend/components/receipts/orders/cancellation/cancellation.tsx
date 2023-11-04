import { ReceiptComponentProps } from '../../receipts'
import { useEffect } from 'react'
import { useOrdersStore } from '../../../../stores/orders-store'
import { useJsonRpcClient } from '../../../../contexts/json-rpc/json-rpc-context'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'
import { CancellationView } from './cancellation-view'

export const Cancellation = ({ transaction }: ReceiptComponentProps) => {
  const { error, getOrderById, lastUpdated, order } = useOrdersStore((state) => ({
    getOrderById: state.getOrderById,
    lastUpdated: state.lastUpdated,
    order: state.order,
    error: state.error
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
    <ReceiptWrapper errors={[error]}>
      <CancellationView cancellation={cancellation} order={order} />
      {order && lastUpdated && (
        <div className="text-sm text-gray-500 mt-2">Last Updated: {new Date(lastUpdated).toLocaleString()}</div>
      )}
    </ReceiptWrapper>
  )
}
