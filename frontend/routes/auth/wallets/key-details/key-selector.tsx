import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@vegaprotocol/ui-toolkit'
import { VegaKey } from '../../../../components/keys/vega-key'
import { IconChevronDown } from '../../../../components/icons/chevron-down'
import { Key, useWalletStore } from '../../../../stores/wallets'
import { NavLink } from 'react-router-dom'
import { FULL_ROUTES } from '../../../route-names'

export const locators = {
  keySelectedCurrentKey: 'key-selected-current-key',
  keySelectedDropdown: 'key-selected-dropdown',
  keySelectedDropdownItem: 'key-selected-dropdown-item',
  keySelectorTrigger: 'key-selector-trigger'
}

export const KeySelector = ({ currentKey }: { currentKey: Key }) => {
  const { keys } = useWalletStore((state) => ({
    keys: state.wallets.flatMap((w) => w.keys)
  }))
  return (
    <div className="item-center">
      <DropdownMenu
        modal={false}
        trigger={
          <DropdownMenuTrigger data-testid={locators.keySelectorTrigger} className="text-white">
            <div data-testid={locators.keySelectedCurrentKey} className="flex items-center">
              <span className="mr-1 text-2xl">{currentKey.name}</span> <IconChevronDown size={16} />
            </div>
          </DropdownMenuTrigger>
        }
      >
        <DropdownMenuContent style={{ overflow: 'hidden', overflowY: 'auto', maxHeight: 360 }}>
          <div data-testid={locators.keySelectedDropdown} className="m-4">
            <h1 className="text-vega-dark-300 text-sm uppercase">Keys</h1>
            {keys.map((k) => (
              <div data-testid={locators.keySelectedDropdownItem} className="my-3 text-base" key={k.publicKey}>
                <NavLink to={{ pathname: `${FULL_ROUTES.wallets}/${k.publicKey}` }}>
                  <VegaKey publicKey={k.publicKey} name={k.name} />
                </NavLink>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
