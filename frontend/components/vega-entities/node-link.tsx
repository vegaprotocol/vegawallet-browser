import { truncateMiddle } from '@vegaprotocol/ui-toolkit'

import config from '!/config'
import { ExternalLink } from '@/components/external-link'

export const locators = {
  nodeLink: 'node-link'
}

export const NodeLink = ({ nodeId, name }: { nodeId: string; name?: string }) => (
  <ExternalLink data-testid={locators.nodeLink} href={`${config.network.governance}/validators/${nodeId}`}>
    {name ?? truncateMiddle(nodeId)}
  </ExternalLink>
)
