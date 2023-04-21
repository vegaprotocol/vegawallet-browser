import classnames from 'classnames'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { DropdownArrow } from '../icons/dropdown-arrow'

export const CollapsiblePanel = ({
  initiallyOpen = false,
  title,
  panelContent,
}: {
  initiallyOpen?: boolean
  title: string
  panelContent: ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen)
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-testid="collapsible-panel-button"
      >
        <span
          className="text-dark-300 uppercase"
          data-testid="collapsible-panel-title"
        >
          {title}
        </span>
        <DropdownArrow
          className={classnames('w-3 ml-3 mb-1', {
            'rotate-180': isOpen,
          })}
        />
      </button>
      <div
        data-testid="collapsible-panel-content"
        className={!isOpen ? 'hidden' : ''}
      >
        {panelContent}
      </div>
    </div>
  )
}
