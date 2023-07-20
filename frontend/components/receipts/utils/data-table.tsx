import { ReactNode } from 'react'

export const locators = {
  dataRow: 'data-row',
  dataKey: 'data-key',
  dataValue: 'data-value'
}

interface DataTableProps {
  items: [ReactNode, ReactNode][]
}

export const DataTable = ({ items }: DataTableProps) => {
  return (
    <>
      {items.map(([key, value], i) => (
        <dl
          data-testid={locators.dataRow}
          key={`data-row-${i}`}
          className="flex gap-1 flex-wrap justify-between py-1 text-sm flex-row items-center"
        >
          <dt data-testid={locators.dataKey} className="text-vega-dark-300 break-words">
            {key}
          </dt>
          <dd data-testid={locators.dataValue} className="break-words">
            {value}
          </dd>
        </dl>
      ))}
    </>
  )
}
