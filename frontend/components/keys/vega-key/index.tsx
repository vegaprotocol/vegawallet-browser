import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { ReactNode } from 'react'

import config from '!/config'

import { CopyWithCheckmark } from '../../copy-with-check'
import { ExternalLink } from '../../external-link'
import { KeyIcon } from '../vega-icon'

export const locators = {
  keyName: 'vega-key-name',
  explorerLink: 'vega-explorer-link'
}

export const VegaKey = ({
  publicKey,
  name,
  children,
  actions
}: {
  publicKey: string
  name?: string
  children?: ReactNode
  actions?: ReactNode
}) => {
  return (
    <div className="flex items-center justify-between h-12">
      <div className="flex items-center">
        <KeyIcon publicKey={publicKey} />
        <div className="ml-4">
          {name ? (
            <div data-testid={locators.keyName} className="text-left text-white" style={{ wordBreak: 'break-word' }}>
              {name}
            </div>
          ) : null}
          <div>
            <ExternalLink
              className="text-vega-dark-400"
              data-testid={locators.explorerLink}
              href={`${config.network.explorer}/parties/${publicKey}`}
            >
              {truncateMiddle(publicKey)}
            </ExternalLink>
            <CopyWithCheckmark text={publicKey} />
            {actions}
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
