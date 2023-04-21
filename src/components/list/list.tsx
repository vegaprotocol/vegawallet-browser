import type { ReactNode } from 'react'
import { ListItem } from './list-item'

export function List<T>({
  items,
  empty,
  idProp,
  renderItem,
  clickable = false,
}: {
  items: T[]
  empty?: ReactNode
  idProp: keyof T
  renderItem: (item: T) => ReactNode
  clickable?: boolean
}) {
  if (!items.length) {
    return <>{empty}</>
  }
  return (
    <ul data-testid="list">
      {items.map((item) => (
        <ListItem
          clickable={clickable}
          key={item[idProp]?.toString()}
          item={item}
          renderItem={renderItem}
        />
      ))}
    </ul>
  )
}
