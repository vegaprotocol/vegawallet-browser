import { render, screen } from '@testing-library/react'
import { SettingsHeader, locators } from './settings-header'

describe('SettingsHeader', () => {
  it('renders the header text correctly', () => {
    const headerText = 'Settings'
    render(<SettingsHeader text={headerText} />)
    const headerElement = screen.getByTestId(locators.settingsHeader)
    expect(headerElement).toBeInTheDocument()
    expect(headerElement).toHaveTextContent(headerText)
  })
})
