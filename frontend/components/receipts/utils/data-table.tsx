import { ReactNode } from 'react'

export const DataTable = ({ items }: { items: [string, ReactNode][] }) => {
  return (
    <>
      {items.map(([key, value]) => (
        <dl key={key} className="flex gap-1 flex-wrap justify-between py-1 text-sm flex-row items-center">
          <dt className="text-vega-dark-300 break-words">{key}</dt>
          <dd className="break-words">{value}</dd>
        </dl>
      ))}
    </>
  )
}
