import classnames from 'classnames'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { DropdownArrow } from '../icons/dropdown-arrow'

export const locators = {
  collapsibleCardTitle: 'collapsible-card-title',
  collapsibleCard: 'collapsible-card',
  collapsibleCardButton: 'collapsible-card-button',
  collapsibleCardContent: 'collapsible-card-content'
}

export const CollapsibleCard = ({
  initiallyOpen = false,
  title,
  cardContent
}: {
  initiallyOpen?: boolean
  title: string | ReactNode
  cardContent: ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen)
  const titleElement =
    typeof title === 'string' ? (
      <span className="text-vega-dark-300 text-sm uppercase" data-testid={locators.collapsibleCardTitle}>
        {title}
      </span>
    ) : (
      title
    )
  return (
    <div data-testid={locators.collapsibleCard}>
      <button
        className="p-3 hover:bg-vega-dark-200 flex w-full justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
        data-testid={locators.collapsibleCardButton}
      >
        {titleElement}
        <div>
          <DropdownArrow
            className={classnames('w-3 ml-3 mb-1', {
              'rotate-180': isOpen
            })}
          />
        </div>
      </button>
      <div data-testid={locators.collapsibleCardContent} className={classnames('p-3', { hidden: !isOpen })}>
        {cardContent}
      </div>
    </div>
  )
}
