import { ReactNode } from 'react'
import { ReceiptComponentProps } from '../../receipts'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'
import { DataTable } from '../../../data-table/data-table'
import { OrderTable } from '../../utils/order-table'
import { OrderBadges } from '../../utils/order/badges'
import { PriceWithTooltip } from '../../utils/string-amounts/price-with-tooltip'
import { ExpiryStrategyComponent } from './expiry-strategy'
import { formatNanoDate } from '../../../../lib/utils'

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
    expiresAt && Number(expiresAt) !== 0 ? ['Expires at', formatNanoDate(expiresAt)] : null
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]
  return (
    <div className="mb-2">
      <h1 data-testid={locators.sectionHeader} className="text-vega-dark-400">
        {title}
      </h1>
      <DataTable items={data} />
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

export const StopOrderSubmission = ({ transaction }: ReceiptComponentProps) => {
  const order = transaction.stopOrdersSubmission
  return (
    <ReceiptWrapper>
      <StopOrdersSubmissionView stopOrdersSubmission={order} />
    </ReceiptWrapper>
  )
}
