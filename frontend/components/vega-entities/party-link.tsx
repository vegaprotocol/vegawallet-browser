import { ExternalLink, truncateMiddle } from '@vegaprotocol/ui-toolkit'

import { useNetwork } from '@/contexts/network/network-context'

export const locators = {
  partyLink: 'party-link'
}

export const PartyLink = ({ publicKey }: { publicKey: string }) => {
  const { network } = useNetwork()

  return (
    <ExternalLink
      className="text-vega-dark-400 font-mono"
      data-testid={locators.partyLink}
      href={`${network.explorer}/parties/${publicKey}`}
    >
      {truncateMiddle(publicKey)}
    </ExternalLink>
  )
}
