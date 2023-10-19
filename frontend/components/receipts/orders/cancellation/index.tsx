import { ReceiptComponentProps } from '../../receipts'
import { OrderTable } from '../../utils/order-table'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'
import { Intent, Notification } from '@vegaprotocol/ui-toolkit'

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
  return (
    <>
      <OrderTable {...cancellation} />
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
