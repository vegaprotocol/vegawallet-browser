import { formatNumber } from '@vegaprotocol/utils'

import { ConditionalDataTable, RowConfig } from '@/components/data-table/conditional-data-table'
import { VegaMarket } from '@/components/vega-entities/vega-market'
import { MARGIN_MODE_MAP, processMarginMode } from '@/lib/enums'

import { ReceiptComponentProperties } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const UpdateMarginMode = ({ transaction }: ReceiptComponentProperties) => {
  const marginMode = processMarginMode(mode)
  const items: RowConfig<typeof transaction.updateMarginMode>[] = [
    {
      prop: 'marketId',
      render: (marketId) => ['Market', <VegaMarket key="update-margin-mode-market" marketId={marketId} />]
    },
    { prop: 'mode', render: (data) => ['Mode', <>{MARGIN_MODE_MAP[processMarginMode(data.mode)]}</>] },
    { prop: 'marginFactor', render: (data) => ['Leverage', `${formatNumber(1 / Number(data.marginFactor), 2)}X`] },
    { prop: 'marginFactor', render: (data) => ['Margin Factor', data.marginFactor] }
  ]

  return (
    <ReceiptWrapper>
      <ConditionalDataTable items={items} data={transaction.updateMarginMode} />
    </ReceiptWrapper>
  )
}
