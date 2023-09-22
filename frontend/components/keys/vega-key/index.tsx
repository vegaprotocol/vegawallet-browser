import { ExternalLink, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { KeyIcon } from '../vega-icon'
import { CopyWithCheckmark } from '../../copy-with-check'
import config from '!/config'
import { ReactNode } from 'react'

export const locators = {
  keyName: 'vega-key-name',
  explorerLink: 'vega-explorer-link'
}

export const VegaKey = ({ publicKey, name, children }: { publicKey: string; name?: string; children?: ReactNode }) => {
  return (
    <div className="flex items-center">
      <KeyIcon publicKey={publicKey} />
      <div className="ml-4">
        {name ? (
          <div data-testid={locators.keyName} className="text-left text-white">
            {name}
          </div>
        ) : null}
        <ExternalLink
          className="text-vega-dark-400"
          data-testid={locators.explorerLink}
          href={`${config.network.explorer}/parties/${publicKey}`}
        >
          {truncateMiddle(publicKey)}
        </ExternalLink>
        <CopyWithCheckmark text={publicKey} />
        {children}
      </div>
    </div>
  )
}
