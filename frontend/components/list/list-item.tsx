import classNames from 'classnames'
import type { ReactNode } from 'react'
import locators from '../locators'

export function ListItem<T>({
  item,
  renderItem,
  clickable = false
}: {
  item: T
  renderItem: (item: T) => ReactNode
  clickable?: boolean
}) {
  return (
    <li
      data-testid={locators.listItem}
      className={classNames('border-b border-1 border-vega-dark-200 py-4 last:border-0', {
        'hover:bg-vega-dark-150': clickable
      })}
    >
      {renderItem(item)}
    </li>
  )
}
