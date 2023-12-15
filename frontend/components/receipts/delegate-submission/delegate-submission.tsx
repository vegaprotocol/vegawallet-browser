import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { ReactNode } from 'react'

import { DataTable } from '@/components/data-table/data-table'

import { ReceiptComponentProperties } from '../receipts'
import { AmountWithSymbol } from '../utils/string-amounts/amount-with-symbol'
import { NodeLink } from '../utils/vega-entities/node-link'

export const DelegateSubmission = ({ transaction }: ReceiptComponentProperties) => {
  const { nodeId, amount } = transaction.delegateSubmission
  // We know that VEGA always has 18 decimals
  const formattedAmount = formatNumber(toBigNum(amount, 18), 18)

  const items = [
    ['Node ID', <NodeLink nodeId={nodeId} />],
    ['Amount', <AmountWithSymbol amount={formattedAmount} symbol={'VEGA'} />]
  ] as [ReactNode, ReactNode][]
  return <DataTable items={items} />
}
