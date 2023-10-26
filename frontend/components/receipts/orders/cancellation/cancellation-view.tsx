import { OrderTable } from '../../utils/order-table'
import { Intent, Notification, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { vegaOrder } from '@vegaprotocol/rest-clients/dist/trading-data'
import { useMarketsStore } from '../../../../stores/markets-store'
import get from 'lodash/get'

export const locators = {
  cancellationNotification: 'cancellation-notification',
  cancellationView: 'cancellation-view'
}

export const CancellationNotification = ({ orderId, marketId }: { orderId: string; marketId: string }) => {
  const { getMarketById } = useMarketsStore((state) => ({
    getMarketById: state.getMarketById
  }))
  if (orderId) return null
  const market = getMarketById(marketId)

  return (
    <div className="mt-2" data-testid={locators.cancellationNotification}>
      {marketId ? (
        <Notification
          intent={Intent.Warning}
          message={`Cancel ALL open orders in ${
            get(market, 'tradableInstrument.instrument.code') || truncateMiddle(marketId)
          }`}
        />
      ) : (
        <Notification intent={Intent.Warning} message={'Cancel ALL orders in ALL markets'} />
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
