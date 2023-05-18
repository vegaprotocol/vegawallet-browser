import type { ReactNode } from 'react'
import { Settings } from '../icons/settings'
import { Wallet } from '../icons/wallet'
import type { To } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { FULL_ROUTES } from '../../routes/route-names'
import locators from '../locators'

export interface NavButtonProps {
  end?: boolean
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

export const NavButton = ({ icon, text, to, end, isFairground }: NavButtonProps) => {
  const textColors = isFairground ? TEXT_COLOR.fairground : TEXT_COLOR.default
  return (
    <NavLink end={end} data-testid={locators.navButton} to={to} className="text-center">
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
      className={classnames('z-10 w-full h-20 grid gap-0 grid-cols-[1fr_1fr] border-t border-vega-dark-200', {
        'bg-black': !isFairground,
        'bg-vega-yellow-500': isFairground
      })}
    >
      <NavButton
        isFairground={isFairground}
        end={true}
        icon={<Wallet className="m-auto" squareFill={isFairground ? '#D7FB50' : 'black'} />}
        to={{ pathname: FULL_ROUTES.wallets }}
        text="Wallets"
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
