import { formatDateWithLocalTimezone } from '@vegaprotocol/utils'
import { useEffect } from 'react'

import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { useNetwork } from '@/contexts/network/network-context'
import { nanoSecondsToMilliseconds } from '@/lib/utils'
import { useOrdersStore } from '@/stores/orders-store'

import { ReceiptComponentProperties } from '../../receipts'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'
import { CancellationView } from './cancellation-view'

export const Cancellation = ({ transaction }: ReceiptComponentProperties) => {
  const { network } = useNetwork()
  const { error, getOrderById, lastUpdated, order, loading } = useOrdersStore((state) => ({
    getOrderById: state.getOrderById,
    lastUpdated: state.lastUpdated,
    order: state.order,
    error: state.error,
    loading: state.loading
  }))
  const cancellation = transaction.orderCancellation
  const { orderId } = cancellation
  const { request } = useJsonRpcClient()

  useEffect(() => {
    if (orderId) {
      getOrderById(request, orderId, network.id)
    }
  }, [orderId, getOrderById, request, network.id])
  if (!order && !loading && lastUpdated) throw new Error('Order not found')
  return (
    <ReceiptWrapper errors={[error]}>
      <CancellationView cancellation={cancellation} order={order} />
      {order && lastUpdated && (
        <div className="text-sm text-gray-500 mt-2">
          Last Updated: {formatDateWithLocalTimezone(new Date(nanoSecondsToMilliseconds(lastUpdated)))}
        </div>
      )}
    </ReceiptWrapper>
  )
}
