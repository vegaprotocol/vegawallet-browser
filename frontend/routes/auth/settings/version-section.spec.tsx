import { render, screen } from '@testing-library/react'
import { VersionSection, locators } from './version-section'
import packageJson from '../../../../package.json'
import { locators as headerLocators } from './settings-header'

describe('VersionSection', () => {
  it('renders the section header correctly', () => {
    render(<VersionSection />)
    const headerElement = screen.getByTestId(headerLocators.settingsHeader)
    expect(headerElement).toBeInTheDocument()
  })

  it('renders the version number correctly', () => {
    render(<VersionSection />)
    const versionNumberElement = screen.getByTestId(locators.settingsVersionNumber)
    expect(versionNumberElement).toBeInTheDocument()
    expect(versionNumberElement).toHaveTextContent(packageJson.version)
  })
})
