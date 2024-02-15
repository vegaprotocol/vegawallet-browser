import { ConditionalDataTable, RowConfig } from '@/components/data-table/conditional-data-table'
import { TeamLink } from '@/components/vega-entities/team-link'
import { VegaTeam } from '@/components/vega-entities/vega-team'

import { ReceiptComponentProperties } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const JoinTeam = ({ transaction }: ReceiptComponentProperties) => {
  const items: RowConfig<typeof transaction.joinTeam>[] = [
    { prop: 'id', render: (data) => ['Team', <VegaTeam key="join-team-name" id={data.id} />] },
    { prop: 'id', render: (data) => ['Team Id', <TeamLink key="join-team-id" id={data.id} />] }
  ]
  return (
    <ReceiptWrapper>
      <ConditionalDataTable items={items} data={transaction.joinTeam} />
    </ReceiptWrapper>
  )
}
