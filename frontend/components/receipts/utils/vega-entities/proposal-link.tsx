import { truncateMiddle } from '@vegaprotocol/ui-toolkit'

import config from '!/config'
import { ExternalLink } from '@/components/external-link'

export const locators = {
  proposalLink: 'proposal-link'
}

export const ProposalLink = ({ proposalId, name }: { proposalId: string; name?: string }) => (
  <ExternalLink data-testid={locators.proposalLink} href={`${config.network.governance}/proposals/${proposalId}`}>
    {name ?? truncateMiddle(proposalId)}
  </ExternalLink>
)
