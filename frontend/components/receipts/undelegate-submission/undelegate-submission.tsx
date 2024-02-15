import { formatNumber, toBigNum } from '@vegaprotocol/utils'

import { ConditionalDataTable, RowConfig } from '@/components/data-table/conditional-data-table'
import { processUndelegateMethod, UNDELEGATE_METHOD_MAP } from '@/lib/enums'

import { NodeLink } from '../../vega-entities/node-link'
import { ReceiptComponentProperties } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'
import { AmountWithSymbol } from '../utils/string-amounts/amount-with-symbol'

export const UndelegateSubmission = ({ transaction }: ReceiptComponentProperties) => {
  const { amount } = transaction.undelegateSubmission
  // We know that VEGA always has 18 decimals
  const formattedAmount = formatNumber(toBigNum(amount, 18), 18)
  const undelegateMethod = processUndelegateMethod(method)

  const items: RowConfig<typeof transaction.undelegateSubmission>[] = [
    { prop: 'nodeId', render: (data) => ['Node Id', <NodeLink nodeId={data.nodeId} />] },
    {
      prop: 'amount',
      render: () => ['Amount', <AmountWithSymbol amount={formattedAmount} symbol={'VEGA'} />]
    },
    {
      prop: 'method',
      render: (data) => ['Method', <>{UNDELEGATE_METHOD_MAP[processUndelegateMethod(data.method)]}</>]
    }
  ]
  return (
    <ReceiptWrapper>
      <ConditionalDataTable items={items} data={transaction.undelegateSubmission} />
    </ReceiptWrapper>
  )
}
