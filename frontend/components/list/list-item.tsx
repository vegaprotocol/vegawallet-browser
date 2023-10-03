import type { ReactNode } from 'react'
import locators from '../locators'

export function ListItem<T>({ item, renderItem }: { item: T; renderItem: (item: T) => ReactNode }) {
  return (
    <li data-testid={locators.listItem} className={'border-b border-1 border-vega-dark-200 py-4 last:border-0'}>
      {renderItem(item)}
    </li>
  )
}
