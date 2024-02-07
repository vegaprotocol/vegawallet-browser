import classnames from 'classnames'
import type { ReactNode } from 'react'
import type { To } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

import { FULL_ROUTES } from '../../routes/route-names'
import { LeftRightArrows } from '../icons/left-right-arrows'
import { Settings } from '../icons/settings'
import { UpDownArrows } from '../icons/up-down-arrows'
import { Wallet } from '../icons/wallet'
import locators from '../locators'

export interface NavButtonProperties {
  icon: ReactNode
  text: string
  to: To
  isFairground: boolean
}

const TEXT_COLOR = {
  fairground: {
    active: 'text-black',
    inactive: 'text-neutral-600'
  },
  default: {
    active: 'text-white',
    inactive: 'text-neutral-600'
  }
}

export const NavButton = ({ icon, text, to, isFairground }: NavButtonProperties) => {
  const textColors = isFairground ? TEXT_COLOR.fairground : TEXT_COLOR.default
  return (
    <NavLink data-testid={locators.navButton} to={to} className="text-center">
      {({ isActive }) => {
        const textColor = isActive ? textColors.active : textColors.inactive

        return (
          <div className="h-full grid gap-0 grid-rows-[1fr_auto_auto]">
            <div className={classnames('grid items-center mt-5', textColor)}>{icon}</div>
            <span className={classnames('mt-2 text-xs', textColor)}>{text}</span>
            <div
              data-testid={locators.linkActive}
              className={classnames('h-1 w-full mt-2', {
                'bg-vega-yellow': isActive && !isFairground,
                'bg-black': isActive && isFairground
              })}
            />
          </div>
        )
      }}
    </NavLink>
  )
}

export const NavBar = ({ isFairground }: { isFairground: boolean }) => {
  return (
    <nav
      data-testid={locators.navBar}
      className={classnames('z-[5] w-full h-20 grid gap-0 grid-cols-4 border-t border-vega-dark-200', {
        'bg-black': !isFairground,
        'bg-vega-yellow-500': isFairground
      })}
    >
      <NavButton
        isFairground={isFairground}
        icon={<Wallet className="m-auto" squareFill={isFairground ? '#D7FB50' : 'black'} />}
        to={{ pathname: FULL_ROUTES.wallets }}
        text="Wallets"
      />
      <NavButton
        isFairground={isFairground}
        icon={<UpDownArrows className="m-auto" />}
        to={{ pathname: FULL_ROUTES.connections }}
        text="Connections"
      />
      <NavButton
        isFairground={isFairground}
        icon={<LeftRightArrows className="m-auto" />}
        to={{ pathname: FULL_ROUTES.transactions }}
        text="Transactions"
      />
      <NavButton
        isFairground={isFairground}
        icon={<Settings className="m-auto" />}
        to={{ pathname: FULL_ROUTES.settings }}
        text="Settings"
      />
    </nav>
  )
}
