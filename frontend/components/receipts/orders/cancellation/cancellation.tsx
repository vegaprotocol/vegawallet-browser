import { ReceiptComponentProps } from '../../receipts'
import { useEffect, useState } from 'react'
import { vegaOrder } from '@vegaprotocol/rest-clients/dist/trading-data'
import { OrdersStore, useOrdersStore } from '../../../../stores/orders-store'
import { useJsonRpcClient } from '../../../../contexts/json-rpc/json-rpc-context'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'
import { CancellationView } from './index'

export const orderSelector = (state: OrdersStore) => ({
  getOrderById: state.getOrderById,
  lastUpdated: state.lastUpdated
})

export const Cancellation = ({ transaction }: ReceiptComponentProps) => {
  const [order, setOrder] = useState<vegaOrder | null>(null)
  const { getOrderById, lastUpdated } = useOrdersStore(orderSelector)
  const cancellation = transaction.orderCancellation
  const { orderId } = cancellation
  const { request } = useJsonRpcClient()

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId, request).then((result) => {
        if (result) {
          setOrder(result)
        }
      })
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
