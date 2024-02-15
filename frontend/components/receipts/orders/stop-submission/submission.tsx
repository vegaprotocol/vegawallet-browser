import { StopOrderExpiryStrategy } from '@vegaprotocol/rest-clients/dist/trading-data'

import { ConditionalDataTable, RowConfig } from '@/components/data-table/conditional-data-table'
import { EXPIRY_STRATEGY_MAP, processExpiryStrategy } from '@/lib/enums'
import { formatNanoDate } from '@/lib/utils'

import { ReceiptComponentProperties } from '../../receipts'
import { OrderBadges } from '../../utils/order/badges'
import { OrderTable } from '../../utils/order-table'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'
import { PriceWithTooltip } from '../../utils/string-amounts/price-with-tooltip'

export const locators = {
  sectionHeader: 'section-header',
  orderDetails: 'order-details'
}

const SubmissionDetails = ({ title, stopOrderDetails }: { title: string; stopOrderDetails: any }) => {
  const { orderSubmission = {} } = stopOrderDetails
  const marketId = orderSubmission.marketId

  const items: RowConfig<typeof stopOrderDetails>[] = [
    {
      prop: 'price',
      render: (data) => [
        'Trigger price',
        <PriceWithTooltip key={`${title}-trigger-price`} price={data.price} marketId={marketId} />
      ]
    },
    { prop: 'trailingPercentOffset', render: (data) => ['Trailing offset', `${data.trailingPercentOffset}%`] },
    {
      prop: 'expiryStrategy',
      render: (data) => ['Expiry strategy', <>{EXPIRY_STRATEGY_MAP[processExpiryStrategy(data.expiryStrategy)]}</>]
    },
    {
      prop: 'expiresAt',
      render: (data) => ['Expires at', Number(data.expiresAt) === 0 ? 'Never' : formatNanoDate(data.expiresAt)]
    }
  ]

  return (
    <div className="mb-2">
      <h1 data-testid={locators.sectionHeader} className="text-vega-dark-400">
        {title}
      </h1>
      <ConditionalDataTable items={items} data={stopOrderDetails} />
      <h2 data-testid={locators.orderDetails} className="text-vega-dark-300">
        Order details
      </h2>
      <OrderTable {...orderSubmission} />
      <OrderBadges {...orderSubmission} />
    </div>
  )
}

export const StopOrdersSubmissionView = ({ stopOrdersSubmission }: { stopOrdersSubmission: any }) => {
  return (
    <>
      {stopOrdersSubmission.risesAbove ? (
        <SubmissionDetails title="Rises Above ↗" stopOrderDetails={stopOrdersSubmission.risesAbove} />
      ) : null}
      {stopOrdersSubmission.fallsBelow ? (
        <SubmissionDetails title="Falls Below ↘" stopOrderDetails={stopOrdersSubmission.fallsBelow} />
      ) : null}
    </>
  )
}

export const StopOrderSubmission = ({ transaction }: ReceiptComponentProperties) => {
  const order = transaction.stopOrdersSubmission
  return (
    <ReceiptWrapper>
      <StopOrdersSubmissionView stopOrdersSubmission={order} />
    </ReceiptWrapper>
  )
}
