import classNames from 'classnames'
import type { ReactNode } from 'react'

export function ListItem<T>({
  item,
  renderItem,
  clickable = false,
}: {
  item: T
  renderItem: (item: T) => ReactNode
  clickable?: boolean
}) {
  return (
    <li
      data-testid="list-item"
      className={classNames('border-b border-1 border-dark-200 py-4 pl-2', {
        'hover:bg-vega-dark-150': clickable,
      })}
    >
      {renderItem(item)}
    </li>
  )
}
