import { truncateMiddle } from '@vegaprotocol/ui-toolkit'

import { useNetwork } from '@/contexts/network/network-context'

import { CopyWithCheckmark } from '../../copy-with-check'
import { ExternalLink } from '../../external-link'
import { EthereumIcon } from '../ethereum-icon'

export const locators = {
  title: 'ethereum-key-title',
  keyName: 'ethereum-key-name',
  explorerLink: 'ethereum-explorer-link'
}

export const EthereumKey = ({ address }: { address: string }) => {
  const { network } = useNetwork()
  return (
    <div className="flex items-center">
      <EthereumIcon />
      <div className="ml-4">
        <div data-testid={locators.title} className="text-left text-white">
          Ethereum Address
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
