import { fireEvent, render, screen } from '@testing-library/react'
import { CollapsiblePanel } from './collapsible-panel'
import locators from '../locators'

const renderComponent = ({ initiallyOpen = false }: { initiallyOpen?: boolean }) => {
  return render(
    <CollapsiblePanel title="Title" initiallyOpen={initiallyOpen} panelContent={<div>Panel content</div>} />
  )
}

describe('Collapsible panel', () => {
  it('renders title, arrow and does not render content', () => {
    renderComponent({})
    expect(screen.getByTestId(locators.collapsiblePanelButton)).toBeInTheDocument()
    expect(screen.getByTestId(locators.collapsiblePanelTitle)).toHaveTextContent('Title')
    expect(screen.getByTestId(locators.collapsiblePanelContent)).toHaveClass('hidden')
    expect(screen.getByTestId(locators.dropdownArrow)).toBeInTheDocument()
  })
  it('opens panel on click', () => {
    renderComponent({})
    fireEvent.click(screen.getByTestId(locators.collapsiblePanelButton))
    expect(screen.getByTestId(locators.collapsiblePanelContent)).not.toHaveClass('hidden')
    expect(screen.getByTestId(locators.dropdownArrow)).toHaveClass('rotate-180')
  })
  it('renders panel as open when initially open is true', () => {
    renderComponent({ initiallyOpen: true })
    expect(screen.getByTestId(locators.collapsiblePanelContent)).not.toHaveClass('hidden')
    expect(screen.getByTestId(locators.dropdownArrow)).toHaveClass('rotate-180')
  })
})
