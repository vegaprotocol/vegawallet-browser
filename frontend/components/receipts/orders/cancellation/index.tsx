import { useState, useEffect } from 'react'
import { ReceiptComponentProps } from '../../receipts'
import { OrderTable } from '../../utils/order-table'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'
import { Intent, Notification } from '@vegaprotocol/ui-toolkit'
import { useOrdersStore } from '../../../../stores/orders-store.ts'
import { useJsonRpcClient } from '../../../../contexts/json-rpc/json-rpc-context.ts'

export const CancellationNotification = ({ orderId, marketId }: { orderId: string; marketId: string }) => {
  if (orderId) return null

  return (
    <div className="mt-2">
      {marketId ? (
        <Notification intent={Intent.Warning} message={'Cancel all open orders in this market'} />
      ) : (
        <Notification intent={Intent.Warning} message={'Cancel all open orders in all markets'} />
      )}
    </div>
  )
}

export const CancellationView = ({ cancellation }: { cancellation: any }) => {
  const { orderId, marketId } = cancellation
  const [orderDetails, setOrderDetails] = useState<{ order: any; lastUpdated: number | null }>({
    order: null,
    lastUpdated: null
  })

  const getOrderById = useOrdersStore((state) => state.getOrderById)
  const { request } = useJsonRpcClient()

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId, request)
        .then((result) => {
          setOrderDetails({ order: result.order, lastUpdated: result.lastUpdated })
        })
        .catch((err) => {
          console.log('Failed to fetch order details:', err)
        })
    }
  }, [orderId, getOrderById, request])

  return (
    <>
      <OrderTable {...{ ...cancellation, ...orderDetails.order }} />
      {orderDetails.lastUpdated && (
        <div className="text-sm text-gray-500 mt-2">
          Last Updated: {new Date(orderDetails.lastUpdated).toLocaleString()}
        </div>
      )}
      <CancellationNotification orderId={orderId} marketId={marketId} />
    </>
  )
}

export const Cancellation = ({ transaction }: ReceiptComponentProps) => {
  const cancellation = transaction.orderCancellation
  return (
    <ReceiptWrapper>
      <CancellationView cancellation={cancellation} />
    </ReceiptWrapper>
  )
}
