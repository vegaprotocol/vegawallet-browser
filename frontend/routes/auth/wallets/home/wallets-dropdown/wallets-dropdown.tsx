import { ButtonLink, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@vegaprotocol/ui-toolkit'
import { IconChevronDown } from '../../../../../components/icons/chevron-down'
import { Wallet, useWalletStore } from '../../../../../stores/wallets'
import { useState } from 'react'
import { Header } from '../../../../../components/header'
import { List } from '../../../../../components/list'
import { NavLink } from 'react-router-dom'
import { FULL_ROUTES } from '../../../../route-names'
import { SubHeader } from '../../../../../components/sub-header'

export const locators = {
  walletSelectorCurrent: (keyName: string) => `${keyName}-selected-current-key`,
  walletSelectorDropdown: 'wallet-selector-dropdown',
  walletSelectorTrigger: 'wallet-selector-trigger'
}

export const WalletSelector = ({ currentWallet }: { currentWallet: Wallet }) => {
  const { wallets } = useWalletStore((state) => ({
    wallets: state.wallets
  }))
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="item-center">
      <DropdownMenu
        modal={true}
        open={open}
        trigger={
          <DropdownMenuTrigger
            onClick={() => setOpen(!open)}
            data-testid={locators.walletSelectorTrigger}
            className="text-white"
          >
            <div
              data-testid={locators.walletSelectorCurrent(currentWallet.name)}
              className="flex items-center text-left"
            >
              <Header content={currentWallet.name} />{' '}
              <span className="ml-2">
                <IconChevronDown size={16} />
              </span>
            </div>
          </DropdownMenuTrigger>
        }
      >
        <DropdownMenuContent
          style={{ overflow: 'hidden', overflowY: 'auto', maxHeight: 360 }}
          onInteractOutside={() => setOpen(false)}
          onEscapeKeyDown={() => setOpen(false)}
        >
          <div data-testid={locators.walletSelectorDropdown} className="my-4">
            <SubHeader content="Wallets" />
            <List<Wallet>
              idProp="name"
              items={[...wallets, ...wallets, ...wallets]}
              renderItem={(wallet) => (
                <div className="flex items-center justify-between mb-2 h-12">
                  <div className="text-base">{wallet.name}</div>
                  <NavLink
                    // TODO reload wallets on click??
                    // onClick={onClick}
                    to={{ pathname: `${FULL_ROUTES.wallets}` }}
                    // data-testid={locators.viewDetails(k.name)}
                    className="hover:bg-vega-dark-200 w-12 h-full border-l border-1 border-vega-dark-150 flex items-center justify-center"
                  >
                    <svg width={24} height={24} viewBox="0 0 16 16">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4.75 14.38L4 13.62L9.63 8.00001L4 2.38001L4.75 1.62001L11.13 8.00001L4.75 14.38Z"
                          fill="currentColor"
                        />
                      </svg>
                    </svg>
                  </NavLink>
                </div>
              )}
            />
            <ButtonLink>Create new wallet</ButtonLink>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
