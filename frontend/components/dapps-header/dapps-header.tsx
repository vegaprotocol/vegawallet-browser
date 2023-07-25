import { Tooltip } from '@vegaprotocol/ui-toolkit'
import { ReactNode } from 'react'
import config from '!/config'

export const locators = {
  walletsHeaderItem: 'wallets-header-item',
  walletsHeaderLink: 'wallets-header-link',
  walletsHeader: 'wallets-header'
}

const TradeIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6.5H22V11M2 6.5L7 1M2 6.5L7 12" stroke="black" />
      <path d="M22 17.5L2 17.5L2 13M22 17.5L17 23M22 17.5L17 12" stroke="black" />
    </svg>
  )
}

const OpenExternal = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 6L5.68629 17.3137" stroke="black" strokeMiterlimit="10" strokeLinecap="square" />
      <path d="M17.5 5L17.5 15" stroke="black" />
      <path d="M18 5.5L8 5.5" stroke="black" />
    </svg>
  )
}

const Tick = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 18.5L2.50001 13" stroke="black" strokeMiterlimit="10" strokeLinecap="square" />
      <path d="M21.5 5L7.94365 18.5563" stroke="black" strokeMiterlimit="10" />
    </svg>
  )
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
      <div data-testid={locators.walletsHeaderItem} className="text-center hover:text-white ml-5 no-underline">
        <a data-testid={locators.walletsHeaderLink} target="_blank" href={href} rel="noreferrer nofollow noopener">
          <div className="rounded-full p-2 bg-vega-yellow">{icon}</div>
          <div className="text-xs mt-1">{text}</div>
        </a>
      </div>
    </Tooltip>
  )
}

export const DappsHeader = () => {
  return (
    <div
      className="flex bg-vega-dark-150/25 w-full py-3 border-b border-1 border-vega-dark-150"
      data-testid={locators.walletsHeader}
    >
      <DappsHeaderButton href={config.network.console} tooltipContent="Console" icon={<TradeIcon />} text="Trade" />
      <DappsHeaderButton href={config.network.governance} tooltipContent="Governance" icon={<Tick />} text="Vote" />
      <DappsHeaderButton
        href={config.network.vegaDapps}
        tooltipContent="Vega dapps"
        icon={<OpenExternal />}
        text="Browse"
      />
    </div>
  )
}
