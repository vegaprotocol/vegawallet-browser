import { vegaVoteValue } from '@vegaprotocol/rest-clients/dist/trading-data'

import { ConditionalDataTable, RowConfig } from '@/components/data-table/conditional-data-table'
import { processVoteValue, VOTE_VALUE_MAP } from '@/lib/enums'

import { ProposalLink } from '../../vega-entities/proposal-link'
import { ReceiptComponentProperties } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const VoteSubmission = ({ transaction }: ReceiptComponentProperties) => {
  const items: RowConfig<typeof transaction.voteSubmission>[] = [
    { prop: 'proposalId', render: (data) => ['Proposal Id', <ProposalLink proposalId={data.proposalId} />] },
    { prop: 'value', render: (data) => ['Value', <>{VOTE_VALUE_MAP[processVoteValue(data.value)]}</>] }
  ]

  return (
    <ReceiptWrapper>
      <ConditionalDataTable items={items} data={transaction.voteSubmission} />
    </ReceiptWrapper>
  )
}
