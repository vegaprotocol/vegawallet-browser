import { truncateMiddle } from '@vegaprotocol/ui-toolkit'

import { ConditionalDataTable, RowConfig } from '@/components/data-table/conditional-data-table'

import { MarketLink } from '../../../vega-entities/market-link'
import { ReceiptComponentProperties } from '../../receipts'
import { ReceiptWrapper } from '../../utils/receipt-wrapper'

export const StopOrderCancellationView = ({ stopOrdersCancellation }: { stopOrdersCancellation: any }) => {
  const items: RowConfig<typeof stopOrdersCancellation>[] = [
    {
      prop: 'marketId',
      render: (data) => ['Market', <MarketLink key="order-details-market" marketId={data.marketId} />]
    },
    {
      prop: 'stopOrderId',
      render: (data) => ['Stop Order', truncateMiddle(data.stopOrderId)]
    }
  ]
  return <ConditionalDataTable items={items} data={stopOrdersCancellation} />
}

export const StopOrderCancellation = ({ transaction }: ReceiptComponentProperties) => {
  const { stopOrdersCancellation } = transaction

  return (
    <ReceiptWrapper>
      <StopOrderCancellationView stopOrdersCancellation={stopOrdersCancellation} />
    </ReceiptWrapper>
  )
}
