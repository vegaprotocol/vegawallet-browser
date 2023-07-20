import { ExternalLink, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { KeyIcon } from '../vega-icon'
import { CopyWithCheckmark } from '../../copy-with-check'
import config from '@/config'

export const locators = {
  keyName: 'key-name',
  explorerLink: 'explorer-link'
}

export const VegaKey = ({ publicKey, name }: { publicKey: string; name: string }) => {
  return (
    <div className="flex items-center">
      <KeyIcon publicKey={publicKey} />
      <div className="ml-4">
        <div data-testid={locators.keyName} className="text-lg text-white">
          {name}
        </div>
        <ExternalLink data-testid={locators.explorerLink} href={`${config.network.explorer}/parties/${publicKey}`}>
          {truncateMiddle(publicKey)}
        </ExternalLink>
        <CopyWithCheckmark text={publicKey} />
      </div>
    </div>
  )
}
