import type { ReactNode } from 'react'
import { ListItem } from './list-item'
import locators from '../locators'

export function List<T>({
  items,
  className,
  empty,
  idProp,
  renderItem
}: {
  items: T[]
  empty?: ReactNode
  idProp: keyof T
  renderItem: (item: T) => ReactNode
  className?: string
}) {
  if (!items.length) {
    return <>{empty}</>
  }
  return (
    <ul className={className} data-testid={locators.list}>
      {items.map((item) => (
        <ListItem key={item[idProp]?.toString()} item={item} renderItem={renderItem} />
      ))}
    </ul>
  )
}
