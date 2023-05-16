import classnames from 'classnames'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { DropdownArrow } from '../icons/dropdown-arrow'
import locators from '../locators'

export const CollapsiblePanel = ({
  initiallyOpen = false,
  title,
  panelContent
}: {
  initiallyOpen?: boolean
  title: string
  panelContent: ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen)
  return (
    <div data-testid={locators.collapsiblePanel}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-testid={locators.collapsiblePanelButton}
      >
        <span
          className="text-dark-300 uppercase"
          data-testid={locators.collapsiblePanelTitle}
        >
          {title}
        </span>
        <DropdownArrow
          className={classnames('w-3 ml-3 mb-1', {
            'rotate-180': isOpen
          })}
        />
      </button>
      <div
        data-testid={locators.collapsiblePanelContent}
        className={!isOpen ? 'hidden' : ''}
      >
        {panelContent}
      </div>
    </div>
  )
}
