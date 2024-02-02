import { truncateMiddle } from '@vegaprotocol/ui-toolkit'

import { useNetwork } from '@/contexts/network/network-context'

import { ExternalLink } from '../external-link'

export const locators = {
  teamLink: 'team-link'
}

export const TeamLink = ({ id }: { id: string }) => {
  const { network } = useNetwork()
  return (
    <ExternalLink
      data-testid={locators.teamLink}
      className="font-mono"
      href={`${network.console}/#/competitions/teams/${id}`}
    >
      {truncateMiddle(id)}
    </ExternalLink>
  )
}
