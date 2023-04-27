import type { ReactNode } from 'react'
import { ListItem } from './list-item'
import locators from '../locators'

export function List<T>({
  items,
  empty,
  idProp,
  renderItem,
  clickable
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
    <ul data-testid={locators.list}>
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
