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
  title: string | ReactNode
  panelContent: ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen)
  const titleElement =
    typeof title === 'string' ? (
      <span className="text-vega-dark-300 text-sm uppercase" data-testid={locators.collapsiblePanelTitle}>
        {title}
      </span>
    ) : (
      title
    )
  return (
    <div data-testid={locators.collapsiblePanel}>
      <button
        className={classnames('flex justify-between w-full', { 'mb-4': isOpen })}
        onClick={() => setIsOpen(!isOpen)}
        data-testid={locators.collapsiblePanelButton}
      >
        <span className="text-sm uppercase" data-testid={locators.collapsiblePanelTitle}>
          {title}
        </span>
        <DropdownArrow
          className={classnames('w-3 ml-3 mb-1', {
            'rotate-180': isOpen
          })}
        />
      </button>
      <div data-testid={locators.collapsiblePanelContent} className={!isOpen ? 'hidden' : ''}>
        {panelContent}
      </div>
    </div>
  )
}
