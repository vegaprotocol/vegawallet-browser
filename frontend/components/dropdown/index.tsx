import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@vegaprotocol/ui-toolkit'
import { ReactNode, useState } from 'react'

import { IconChevronDown } from '@/components/icons/chevron-down'

export const locators = {
  keySelectedCurrentKey: (keyName: string) => `${keyName}-selected-current-key`,
  keySelectedDropdown: 'key-selected-dropdown',
  keySelectorTrigger: 'key-selector-trigger',
  keySelectorCurrentlySelected: 'key-selector-currently-selected'
}

interface DropdownProperties {
  trigger: ReactNode
  content: (setOpen: (open: boolean) => void) => ReactNode
  enabled?: boolean
}

const WrappedTrigger = ({ clickable, trigger }: { clickable: ReactNode; trigger: ReactNode }) => {
  return (
    <div className="items-center">
      <div data-testid={locators.keySelectorCurrentlySelected} className="flex items-center text-left">
        {trigger}
        {clickable && (
          <span className="ml-2">
            <IconChevronDown size={16} />
          </span>
        )}
      </div>
    </div>
  )
}

export const Dropdown = ({ enabled = false, trigger, content }: DropdownProperties) => {
  const [open, setOpen] = useState<boolean>(false)

  if (!enabled) {
    return <WrappedTrigger clickable={false} trigger={trigger} />
  }

  return (
    <div className="item-center">
      <DropdownMenu
        modal={true}
        open={open}
        trigger={
          <DropdownMenuTrigger
            onClick={() => setOpen(!open)}
            data-testid={locators.keySelectorTrigger}
            className="border-0"
          >
            <WrappedTrigger clickable={true} trigger={trigger} />
          </DropdownMenuTrigger>
        }
      >
        <DropdownMenuContent
          style={{ overflow: 'hidden', overflowY: 'auto', maxHeight: 360 }}
          onInteractOutside={() => setOpen(false)}
          onEscapeKeyDown={() => setOpen(false)}
        >
          {content(setOpen)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
