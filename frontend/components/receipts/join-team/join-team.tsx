import { DataTable } from '@/components/data-table/data-table'
import { VegaTeam } from '@/components/vega-entities/vega-team'

import { ReceiptComponentProperties } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const JoinTeam = ({ transaction }: ReceiptComponentProperties) => {
  return (
    <ReceiptWrapper>
      <DataTable items={[['Team', <VegaTeam key="join-team-id" id={transaction.joinTeam.id} />]]} />
    </ReceiptWrapper>
  )
}
