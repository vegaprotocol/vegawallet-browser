import { Tooltip } from '@vegaprotocol/ui-toolkit'
import { ReactNode } from 'react'

export const locators = {
  walletsHeaderButton: 'wallets-header-button',
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
      <path d="M17 6L5.68629 17.3137" stroke="black" stroke-miterlimit="10" stroke-linecap="square" />
      <path d="M17.5 5L17.5 15" stroke="black" />
      <path d="M18 5.5L8 5.5" stroke="black" />
    </svg>
  )
}

const Tick = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 18.5L2.50001 13" stroke="black" stroke-miterlimit="10" stroke-linecap="square" />
      <path d="M21.5 5L7.94365 18.5563" stroke="black" stroke-miterlimit="10" />
    </svg>
  )
}

const WalletsHeaderButton = ({
  text,
  icon,
  tooltipContent
}: {
  text: string
  icon: ReactNode
  tooltipContent: string
}) => {
  return (
    <Tooltip description={tooltipContent}>
      <div data-testid={locators.walletsHeaderButton} className="text-center">
        <button className="rounded-full p-2 bg-vega-yellow">{icon}</button>
        <div className="no-underline">{text}</div>
      </div>
    </Tooltip>
  )
}

export const WalletsHeader = () => {
  return (
    <div className="grid grid-cols-3 bg-vega-dark-150 w-full py-3" data-testid={locators.walletsHeader}>
      <WalletsHeaderButton tooltipContent="Console" icon={<TradeIcon />} text="Trade" />
      <WalletsHeaderButton tooltipContent="Governance" icon={<Tick />} text="Vote" />
      <WalletsHeaderButton tooltipContent="Vega dapps" icon={<OpenExternal />} text="Browse" />
    </div>
  )
}
