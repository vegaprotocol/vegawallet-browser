import { ExternalLink, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { EthereumIcon } from '../ethereum-icon'
import { CopyWithCheckmark } from '../../copy-with-check'
import config from '@/config'

export const locators = {
  title: 'ethereum-key-title',
  keyName: 'ethereum-key-name',
  explorerLink: 'ethereum-explorer-link'
}

export const EthereumKey = ({ address }: { address: string }) => {
  return (
    <div className="flex items-center">
      <EthereumIcon />
      <div className="ml-4">
        <div data-testid={locators.title} className="text-lg text-white">
          Ethereum Address
        </div>
        <ExternalLink
          className="text-vega-dark-400"
          data-testid={locators.explorerLink}
          href={`${config.network.ethereumExplorerLink}/address/${address}`}
        >
          {truncateMiddle(address)}
        </ExternalLink>
        <CopyWithCheckmark text={address} />
      </div>
    </div>
  )
}
