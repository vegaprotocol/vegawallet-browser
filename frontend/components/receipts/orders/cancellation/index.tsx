import { OrderTable } from '../../utils/order-table'
import { Intent, Notification } from '@vegaprotocol/ui-toolkit'
import { vegaOrder } from '@vegaprotocol/rest-clients/dist/trading-data'

export const locators = {
  cancellationNotification: 'cancellation-notification',
  cancellationView: 'cancellation-view'
}

export const CancellationNotification = ({ orderId, marketId }: { orderId: string; marketId: string }) => {
  if (orderId) return null

  return (
    <div className="mt-2" data-testid={locators.cancellationNotification}>
      {marketId ? (
        <Notification intent={Intent.Warning} message={'Cancel all open orders in this market'} />
      ) : (
        <Notification intent={Intent.Warning} message={'Cancel all open orders in all markets'} />
      )}
    </div>
  )
}

export const CancellationView = ({ cancellation, order }: { cancellation: any; order?: vegaOrder | null }) => {
  const { orderId, marketId } = cancellation

  return (
    <div data-testid={locators.cancellationView}>
      <OrderTable {...{ ...cancellation, ...order }} />
      <CancellationNotification orderId={orderId} marketId={marketId} />
    </div>
  )
}
