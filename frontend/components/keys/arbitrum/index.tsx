import { truncateMiddle } from '@vegaprotocol/ui-toolkit'

import { CopyWithCheckmark } from '@/components/copy-with-check'
import { ExternalLink } from '@/components/external-link'
import { ArbitrumLogo } from '@/components/icons/arbitrum'
import { useNetwork } from '@/contexts/network/network-context'

export const locators = {
  title: 'arbitrum-key-title',
  explorerLink: 'arbitrum-explorer-link'
}

export const ArbitrumKey = ({ address }: { address: string }) => {
  const { network } = useNetwork()
  return (
    <div className="flex items-center">
      <ArbitrumLogo />
      <div className="ml-4">
        <div data-testid={locators.title} className="text-left text-white">
          Arbitrum Address
        </div>
        <ExternalLink
          className="text-vega-dark-400"
          data-testid={locators.explorerLink}
          href={`${network.ethereumExplorerLink}/address/${address}`}
        >
          {truncateMiddle(address)}
        </ExternalLink>
        <CopyWithCheckmark text={address} />
      </div>
    </div>
  )
}
