import get from 'lodash/get'
import has from 'lodash/has'
import { ReactNode } from 'react'

import { DataTable } from './data-table'

export interface RowConfig<T> {
  render: (data: T) => [ReactNode, ReactNode]
  prop: string
}

export function ConditionalDataTable<T>({ items, data }: { items: RowConfig<T>[]; data: T }) {
  const filteredItems = items
    .filter(({ prop }) => {
      if (!has(data, prop)) {
        return false
      }
      const value = get(data, prop)
      // Exclude 0 because 0 could be permitted for certain values
      return value !== undefined && value !== null && value !== ''
    })
    .map(({ render }) => {
      return render(data)
    })
  return <DataTable items={filteredItems} />
}
