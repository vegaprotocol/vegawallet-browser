import { Intent, Notification, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { useMarketsStore } from '../../../../stores/markets-store'
import get from 'lodash/get'

export const locators = {
  cancellationNotification: 'cancellation-notification'
}

export const CancellationNotification = ({ orderId, marketId }: { orderId: string; marketId: string }) => {
  const { getMarketById, loading } = useMarketsStore((state) => ({
    getMarketById: state.getMarketById,
    loading: state.loading
  }))
  if (orderId || loading) return null
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
