import { vegaVoteValue } from '@vegaprotocol/rest-clients/dist/trading-data'
import { ReactNode } from 'react'

import { DataTable } from '@/components/data-table'
import { VOTE_VALUE_MAP } from '@/components/enums'

import { ProposalLink } from '../../vega-entities/proposal-link'
import { ReceiptComponentProperties } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const VoteSubmission = ({ transaction }: ReceiptComponentProperties) => {
  const { proposalId, value } = transaction.voteSubmission
  const items = [
    ['Proposal Id', <ProposalLink proposalId={proposalId} />],
    ['Value', <>{VOTE_VALUE_MAP[value as vegaVoteValue]}</>]
  ] as [ReactNode, ReactNode][]
  return (
    <ReceiptWrapper>
      <DataTable items={items} />
    </ReceiptWrapper>
  )
}
