import { vegaVoteValue } from '@vegaprotocol/rest-clients/dist/trading-data'
import { ReactNode } from 'react'

import { DataTable } from '@/components/data-table/data-table'

import { ReceiptComponentProperties } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'
import { ProposalLink } from '../utils/vega-entities/proposal-link'

const VOTE_VALUE_MAP = {
  [vegaVoteValue.VALUE_YES]: 'For',
  [vegaVoteValue.VALUE_NO]: 'Against',
  [vegaVoteValue.VALUE_UNSPECIFIED]: 'Unspecified'
}

export const VoteSubmission = ({ transaction }: ReceiptComponentProperties) => {
  const { proposalId, value } = transaction.voteSubmission
  const items = [
    ['Proposal ID', <ProposalLink proposalId={proposalId} />],
    ['Vote', <>{VOTE_VALUE_MAP[value as vegaVoteValue]}</>]
  ] as [ReactNode, ReactNode][]
  return (
    <ReceiptWrapper>
      <DataTable items={items} />
    </ReceiptWrapper>
  )
}
