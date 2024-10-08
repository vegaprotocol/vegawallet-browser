import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@vegaprotocol/ui-toolkit'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { IconChevronDown } from '@/components/icons/chevron-down'

export const locators = {
  dropdown: 'dropdown',
  dropdownTrigger: 'dropdown-trigger',
  dropdownSelected: 'dropdown-currently-selected'
}

export interface DropdownProperties {
  trigger: ReactNode
  content: (setOpen: (open: boolean) => void) => ReactNode
  enabled: boolean
}

// TODO: have replaced with duplicated code, however using this component causes jest tests to fail. Inlining the code fixed it.
// const WrappedTrigger = ({ clickable, trigger }: { clickable: ReactNode; trigger: ReactNode }) => {
//   return (
//     <div className="items-center">
//       <div data-testid={locators.dropdownSelected} className="flex items-center text-left">
//         {trigger}
//         {clickable && (
//           <span className="ml-2">
//             <IconChevronDown size={16} />
//           </span>
//         )}
//       </div>
//     </div>
//   )
// }

export const Dropdown = ({ enabled, trigger, content }: DropdownProperties) => {
  const [open, setOpen] = useState<boolean>(false)

  if (!enabled) {
    return (
      <div className="items-center">
        <div data-testid={locators.dropdownSelected} className="flex items-center text-left">
          {trigger}
        </div>
      </div>
    )
  }

  return (
    <div className="item-center">
      <DropdownMenu
        modal={true}
        open={open}
        trigger={
          <DropdownMenuTrigger
            onClick={() => setOpen(!open)}
            data-testid={locators.dropdownTrigger}
            className="border-0"
          >
            <div className="items-center">
              <div data-testid={locators.dropdownSelected} className="flex items-center text-left">
                <>
                  {trigger}
                  <span className="ml-2">
                    <IconChevronDown size={16} />
                  </span>
                </>
              </div>
            </div>
          </DropdownMenuTrigger>
        }
      >
        <DropdownMenuContent
          style={{ overflow: 'hidden', overflowY: 'auto', maxHeight: 360, maxWidth: 300 }}
          onInteractOutside={() => setOpen(false)}
          onEscapeKeyDown={() => setOpen(false)}
        >
          {content(setOpen)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
