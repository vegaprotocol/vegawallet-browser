import { render, screen } from '@testing-library/react'
import { DataTable, locators } from './data-table'

describe('DataTable', () => {
  test('renders the correct number of rows', () => {
    const items: [string, string][] = [
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3']
    ]
    render(<DataTable items={items} />)

    const rows = screen.getAllByTestId(locators.dataRow)
    expect(rows.length).toBe(items.length)
  })

  test('renders the key-value pairs correctly', () => {
    const items: [string, string][] = [
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3']
    ]
    render(<DataTable items={items} />)

    items.forEach(([key, value], i) => {
      const keyElement = screen.getAllByTestId(locators.dataKey)[i]
      const valueElement = screen.getAllByTestId(locators.dataValue)[i]

      expect(keyElement.textContent).toBe(key)
      expect(valueElement.textContent).toBe(value)
    })
  })
})
