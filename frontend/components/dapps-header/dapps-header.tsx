import { Tooltip } from '@vegaprotocol/ui-toolkit'
import { ReactNode } from 'react'

import config from '!/config'

import { ExternalLink } from '../external-link'
import { Deposit } from '../icons/deposit'
import { OpenExternal } from '../icons/open-external'
import { Tick } from '../icons/tick'
import { TradeIcon } from '../icons/trade'
import { Withdraw } from '../icons/withdraw'

export const locators = {
  walletsHeaderItem: 'wallets-header-item',
  walletsHeaderLink: 'wallets-header-link',
  walletsHeader: 'wallets-header'
}

const DappsHeaderButton = ({
  text,
  icon,
  tooltipContent,
  href
}: {
  text: string
  icon: ReactNode
  tooltipContent: string
  href: string
}) => {
  return (
    <Tooltip description={tooltipContent}>
      <div data-testid={locators.walletsHeaderItem} className="text-center hover:text-white no-underline">
        <ExternalLink className="flex flex-col items-center" data-testid={locators.walletsHeaderLink} href={href}>
          <div className="rounded-full p-2 bg-vega-yellow text-black" style={{ maxWidth: '2.5rem' }}>
            {icon}
          </div>
          <div className="text-xs mt-1">{text}</div>
        </ExternalLink>
      </div>
    </Tooltip>
  )
}

export const DappsHeader = () => {
  return (
    <div
      className="flex justify-evenly bg-vega-dark-150/25 w-full py-3 border-b border-1 border-vega-dark-150"
      data-testid={locators.walletsHeader}
    >
      <DappsHeaderButton href={config.network.console} tooltipContent="Console" icon={<TradeIcon />} text="Trade" />
      <DappsHeaderButton
        href={config.network.governance}
        tooltipContent="Governance"
        icon={<Tick size={24} />}
        text="Vote"
      />
      <DappsHeaderButton
        href={config.network.transfer}
        tooltipContent="Transfer"
        icon={<OpenExternal />}
        text="Transfer"
      />
      <DappsHeaderButton href={config.network.deposit} tooltipContent="Deposit" icon={<Deposit />} text="Deposit" />
      <DappsHeaderButton href={config.network.withdraw} tooltipContent="Withdraw" icon={<Withdraw />} text="Withdraw" />
    </div>
  )
}
