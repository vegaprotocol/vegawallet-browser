import { ReactNode } from 'react'

import { DataTable } from '@/components/data-table'
import { processVoteValue, VOTE_VALUE_MAP } from '@/lib/enums'

import { ProposalLink } from '../../vega-entities/proposal-link'
import { ReceiptComponentProperties } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const VoteSubmission = ({ transaction }: ReceiptComponentProperties) => {
  const { proposalId, value } = transaction.voteSubmission
  const voteValue = processVoteValue(value)
  const items = [
    ['Proposal Id', <ProposalLink proposalId={proposalId} />],
    ['Value', <>{VOTE_VALUE_MAP[voteValue]}</>]
  ] as [ReactNode, ReactNode][]
  return (
    <ReceiptWrapper>
      <DataTable items={items} />
    </ReceiptWrapper>
  )
}
