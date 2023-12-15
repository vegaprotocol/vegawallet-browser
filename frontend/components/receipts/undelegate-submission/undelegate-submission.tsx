import { UndelegateSubmissionMethod } from '@vegaprotocol/rest-clients/dist/trading-data'
import { formatNumber, toBigNum } from '@vegaprotocol/utils'
import { ReactNode } from 'react'

import { DataTable } from '@/components/data-table/data-table'

import { NodeLink } from '../../vega-entities/node-link'
import { ReceiptComponentProperties } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'
import { AmountWithSymbol } from '../utils/string-amounts/amount-with-symbol'

const UNDELEGATE_METHOD_MAP: Record<UndelegateSubmissionMethod, string> = {
  [UndelegateSubmissionMethod.METHOD_AT_END_OF_EPOCH]: 'End of epoch',
  [UndelegateSubmissionMethod.METHOD_NOW]: 'Now',
  [UndelegateSubmissionMethod.METHOD_UNSPECIFIED]: 'Unspecified'
}

export const UndelegateSubmission = ({ transaction }: ReceiptComponentProperties) => {
  const { nodeId, amount, method } = transaction.undelegateSubmission
  // We know that VEGA always has 18 decimals
  const formattedAmount = formatNumber(toBigNum(amount, 18), 18)

  const items = [
    ['Node Id', <NodeLink nodeId={nodeId} />],
    ['Amount', <AmountWithSymbol amount={formattedAmount} symbol={'VEGA'} />],
    ['Method', <>{UNDELEGATE_METHOD_MAP[method as UndelegateSubmissionMethod]}</>]
  ] as [ReactNode, ReactNode][]
  return (
    <ReceiptWrapper>
      <DataTable items={items} />
    </ReceiptWrapper>
  )
}
