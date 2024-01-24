import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { ReactNode } from 'react'

import { DataTable } from '@/components/data-table'

import { NodeLink } from '../../vega-entities/node-link'
import { ReceiptComponentProperties } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'
import { AmountWithSymbol } from '../utils/string-amounts/amount-with-symbol'

export const DelegateSubmission = ({ transaction }: ReceiptComponentProperties) => {
  const { nodeId, amount } = transaction.delegateSubmission
  // We know that VEGA always has 18 decimals
  const formattedAmount = formatNumber(toBigNum(amount, 18), 18)

  const items = [
    ['Node Id', <NodeLink nodeId={nodeId} />],
    ['Amount', <AmountWithSymbol amount={formattedAmount} symbol={'VEGA'} />]
  ] as [ReactNode, ReactNode][]
  return (
    <ReceiptWrapper>
      <DataTable items={items} />
    </ReceiptWrapper>
  )
}
