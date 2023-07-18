import { render, screen } from '@testing-library/react'
import { VegaSection } from '.'

describe('SettingsSection', () => {
  it('renders children correctly', () => {
    const childText = 'This is a child element'
    render(
      <VegaSection>
        <div>{childText}</div>
      </VegaSection>
    )
    const childElement = screen.getByText(childText)
    expect(childElement).toBeInTheDocument()
  })
})
