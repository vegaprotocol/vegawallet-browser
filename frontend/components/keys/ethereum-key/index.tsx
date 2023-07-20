import { ExternalLink, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { EthereumIcon } from '../ethereum-icon'
import { CopyWithCheckmark } from '../../copy-with-check'
import config from '@/config'

export const locators = {
  keyName: 'key-name',
  explorerLink: 'explorer-link'
}

export const EthereumKey = ({ address }: { address: string }) => {
  return (
    <div className="flex items-center">
      <EthereumIcon />
      <div className="ml-4">
        <div className="text-lg text-white">Ethereum Address</div>
        {/* TODO need to add the config for ethereum explorer link here */}
        <ExternalLink
          className="text-vega-dark-400"
          data-testid={locators.explorerLink}
          href={`${config.network.explorer}/parties/${address}`}
        >
          {truncateMiddle(address)}
        </ExternalLink>
        <CopyWithCheckmark text={address} />
      </div>
    </div>
  )
}
