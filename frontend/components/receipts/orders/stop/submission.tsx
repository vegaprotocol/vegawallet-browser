import { ReactNode } from 'react'
import { ReceiptComponentProps } from '../../receipts'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'
import { DataTable } from '../../../data-table/data-table'
import { OrderTable } from '../../utils/order-table'
import { OrderBadges } from '../../utils/order/badges'
import { getDateTimeFormat } from '@vegaprotocol/utils'
import { PriceWithTooltip } from '../../utils/string-amounts/price-with-tooltip'
import { ExpiryStrategyComponent } from './expiry-strategy'

export const locators = {
  sectionHeader: 'section-header',
  orderDetails: 'order-details'
}

const SubmissionDetails = ({ title, stopOrderDetails }: { title: string; stopOrderDetails: any }) => {
  const { expiryStrategy, price, expiresAt, trailingPercentOffset, orderSubmission } = stopOrderDetails
  const { marketId } = orderSubmission
  const columns = [
    price
      ? ['Trigger price', <PriceWithTooltip key={`${title}-trigger-price`} price={price} marketId={marketId} />]
      : null,
    trailingPercentOffset && Number(expiresAt) !== 0 ? ['Trailing offset', `${trailingPercentOffset}%`] : null,
    expiryStrategy
      ? [
          'Expiry strategy',
          <ExpiryStrategyComponent key={`${title}-expiry-strategy`} expiryStrategy={expiryStrategy} />
        ]
      : null,
    expiresAt && Number(expiresAt) !== 0 ? ['Expires at', getDateTimeFormat().format(new Date(+expiresAt / 1e6))] : null
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]
  return (
    <div className="mb-2">
      <h1 data-testid={locators.sectionHeader} className="text-white text-lg">
        {title}
      </h1>
      <DataTable items={data} />
      <h2 data-testid={locators.orderDetails} className="text-white">
        Order details
      </h2>
      <OrderTable {...orderSubmission} />
      <OrderBadges {...orderSubmission} />
    </div>
  )
}

export const StopOrderSubmission = ({ transaction }: ReceiptComponentProps) => {
  const order = transaction.stopOrdersSubmission
  return (
    <ReceiptWrapper>
      {order.risesAbove && <SubmissionDetails title="Rises above ↗" stopOrderDetails={order.risesAbove} />}
      {order.fallsBelow && <SubmissionDetails title="Falls below ↘" stopOrderDetails={order.fallsBelow} />}
    </ReceiptWrapper>
  )
}
