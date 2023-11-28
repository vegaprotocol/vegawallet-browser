import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@vegaprotocol/ui-toolkit'
import { useState } from 'react'

import { Header } from '@/components/header'
import { IconChevronDown } from '@/components/icons/chevron-down'
import { KeyList } from '@/components/key-list'
import { Key, useWalletStore } from '@/stores/wallets'

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
            <div data-testid={locators.keySelectedCurrentKey(currentKey.name)} className="flex items-center text-left">
              <Header content={currentKey.name} />{' '}
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
          <div data-testid={locators.keySelectedDropdown} className="my-4">
            <KeyList keys={keys} onClick={() => setOpen(false)} />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
