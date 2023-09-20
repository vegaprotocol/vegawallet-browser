import { List } from './list'
import { render, screen } from '@testing-library/react'

interface Item {
  name: string
  id: string
}

const renderComponent = ({ items, clickable }: { items: Item[]; clickable?: boolean }) =>
  render(
    <List<Item>
      items={items}
      idProp="id"
      empty={<p>Empty</p>}
      renderItem={(i) => <div>{i.name}</div>}
      clickable={clickable}
    />
  )

describe('List', () => {
  it('renders an empty state if there are no items', () => {
    renderComponent({ items: [] })
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })
  it('renders a row per item', () => {
    renderComponent({
      items: [
        {
          name: 'Item 1',
          id: '1'
        },
        {
          name: 'Item 2',
          id: '2'
        },
        {
          name: 'Item 3',
          id: '3'
        }
      ]
    })
    const items = screen.queryAllByTestId('list-item')
    expect(items).toHaveLength(3)
    expect(items.at(0)).toHaveTextContent('Item 1')
  })
  it('renders extra classes if clickable', () => {
    renderComponent({
      items: [
        {
          name: 'Item 1',
          id: '1'
        },
        {
          name: 'Item 2',
          id: '2'
        },
        {
          name: 'Item 3',
          id: '3'
        }
      ],
      clickable: true
    })
    const items = screen.queryAllByTestId('list-item')
    expect(items).toHaveLength(3)
    expect(items.at(0)).toHaveTextContent('Item 1')
    expect(items.at(0)).toHaveClass('hover:bg-vega-dark-200')
  })
})
