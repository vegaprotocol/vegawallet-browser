import { render, screen } from '@testing-library/react'
import { SettingsSection } from './settings-section'

describe('SettingsSection', () => {
  it('renders children correctly', () => {
    const childText = 'This is a child element'
    render(
      <SettingsSection>
        <div>{childText}</div>
      </SettingsSection>
    )
    const childElement = screen.getByText(childText)
    expect(childElement).toBeInTheDocument()
  })
})
