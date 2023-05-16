import { fireEvent, render, screen } from '@testing-library/react'
import { CollapsiblePanel } from './collapsible-panel'

const renderComponent = ({ initiallyOpen = false }: { initiallyOpen?: boolean }) => {
  return render(
    <CollapsiblePanel title="Title" initiallyOpen={initiallyOpen} panelContent={<div>Panel content</div>} />
  )
}

describe('Collapsible panel', () => {
  it('renders title, arrow and does not render content', () => {
    renderComponent({})
    expect(screen.getByTestId('collapsible-panel-button')).toBeInTheDocument()
    expect(screen.getByTestId('collapsible-panel-title')).toHaveTextContent('Title')
    expect(screen.getByTestId('collapsible-panel-content')).toHaveClass('hidden')
    expect(screen.getByTestId('dropdown-arrow')).toBeInTheDocument()
  })
  it('opens panel on click', () => {
    renderComponent({})
    fireEvent.click(screen.getByTestId('collapsible-panel-button'))
    expect(screen.getByTestId('collapsible-panel-content')).not.toHaveClass('hidden')
    expect(screen.getByTestId('dropdown-arrow')).toHaveClass('rotate-180')
  })
  it('renders panel as open when initially open is true', () => {
    renderComponent({ initiallyOpen: true })
    expect(screen.getByTestId('collapsible-panel-content')).not.toHaveClass('hidden')
    expect(screen.getByTestId('dropdown-arrow')).toHaveClass('rotate-180')
  })
})
