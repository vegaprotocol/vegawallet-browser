import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@vegaprotocol/ui-toolkit'
import { IconChevronDown } from '../../../../components/icons/chevron-down'
import { Key, useWalletStore } from '../../../../stores/wallets'
import { useState } from 'react'
import { KeyList } from '../../../../components/key-list'

export const locators = {
  keySelectedCurrentKey: (keyName: string) => `${keyName}-selected-current-key`,
  keySelectedDropdown: 'key-selected-dropdown',
  keySelectorTrigger: 'key-selector-trigger'
}

export const KeySelector = ({ currentKey }: { currentKey: Key }) => {
  const { keys } = useWalletStore((state) => ({
    keys: state.wallets.flatMap((w) => w.keys)
  }))
  const [open, setOpen] = useState<boolean>(false)
  console.log(open)
  return (
    <div className="item-center">
      <DropdownMenu
        modal={true}
        open={open}
        trigger={
          <DropdownMenuTrigger
            onClick={() => setOpen(!open)}
            data-testid={locators.keySelectorTrigger}
            className="text-white"
          >
            <div data-testid={locators.keySelectedCurrentKey(currentKey.name)} className="flex items-center">
              <span className="mr-1 text-2xl">{currentKey.name}</span> <IconChevronDown size={16} />
            </div>
          </DropdownMenuTrigger>
        }
      >
        <DropdownMenuContent
          style={{ overflow: 'hidden', overflowY: 'auto', maxHeight: 360 }}
          onInteractOutside={() => setOpen(false)}
          onEscapeKeyDown={() => setOpen(false)}
        >
          <div data-testid={locators.keySelectedDropdown} className="my-4">
            <KeyList keys={keys} onClick={() => setOpen(false)} />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
