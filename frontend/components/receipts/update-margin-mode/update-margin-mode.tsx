import { vegaMarginMode } from '@vegaprotocol/rest-clients/dist/trading-data'
import { formatNumber } from '@vegaprotocol/utils'
import { ReactNode } from 'react'

import { DataTable } from '@/components/data-table/data-table'
import { MARGIN_MODE_MAP } from '@/components/enums'
import { VegaMarket } from '@/components/vega-entities/vega-market'

import { ReceiptComponentProperties } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const UpdateMarginMode = ({ transaction }: ReceiptComponentProperties) => {
  const { mode, marginFactor, marketId } = transaction.updateMarginMode
  const items = [
    ['Market', <VegaMarket key="update-margin-mode-market" marketId={marketId} />],
    ['Mode', <>{MARGIN_MODE_MAP[mode as vegaMarginMode]}</>],
    ['Margin Factor', marginFactor],
    ['Leverage', formatNumber(1 / Number(marginFactor), 2)]
  ] as [ReactNode, ReactNode][]
  return (
    <ReceiptWrapper>
      <DataTable items={items} />
    </ReceiptWrapper>
  )
}
