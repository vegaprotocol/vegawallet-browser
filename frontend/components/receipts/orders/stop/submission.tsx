import { ReactNode } from 'react'
import { ReceiptComponentProps } from '../../receipts'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'
import { DataTable } from '../../../data-table/data-table'
import { OrderTable } from '../../utils/order-table'
import { OrderBadges } from '../../utils/order/badges'

const SubmissionDetails = ({ title, stopOrderDetails }: { title: string; stopOrderDetails: any }) => {
  const { expiryStrategy, expiresAt, trailingPercentOffset, orderSubmission } = stopOrderDetails
  const columns = [
    expiryStrategy ? ['Expiry Strategy', expiryStrategy] : null,
    expiresAt && Number(expiresAt) !== 0 ? ['Expires at', expiresAt] : null,
    trailingPercentOffset && Number(expiresAt) !== 0 ? ['Trailing offset', `${trailingPercentOffset}%`] : null
  ]
  const data = columns.filter((c) => !!c) as [ReactNode, ReactNode][]
  return (
    <div className="mt-2">
      <h1 className="text-vega-dark-300">{title}</h1>
      <DataTable items={data} />
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
