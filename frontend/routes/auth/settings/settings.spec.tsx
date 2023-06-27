import { render, screen } from '@testing-library/react'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import { Settings } from '.'
import { mockClient } from '../../../test-helpers/mock-client'
import { locators } from '../../../../frontend/routes/auth/settings'

jest.mock('./version-section', () => ({
  VersionSection: () => <div data-testid="version-section" />
}))
jest.mock('./telemetry-section', () => ({
  TelemetrySection: () => <div data-testid="telemetry-section" />
}))
jest.mock('./lock-section', () => ({
  LockSection: () => <div data-testid="lock-section" />
}))
jest.mock('./footer-section', () => ({
  FooterSection: () => <div data-testid="footer-section" />
}))

jest.mock('@config', () => ({
  ...jest.requireActual('../../../../config/test').default,
  closeWindowOnPopupOpen: true
}))

const renderComponent = () =>
  render(
    <JsonRPCProvider>
      <Settings />
    </JsonRPCProvider>
  )

describe('Settings', () => {
  it('renders settings page', () => {
    // 1107-SETT-008 I can see the version # of the browser extension
    // 1107-SETT-009 I can see the feedback link
    mockClient()
    renderComponent()
    expect(screen.getByTestId(locators.settingsPage)).toBeVisible()
    expect(screen.getByTestId('version-section')).toBeVisible()
    expect(screen.getByTestId('telemetry-section')).toBeVisible()
    expect(screen.getByTestId('lock-section')).toBeVisible()
    expect(screen.getByTestId('footer-section')).toBeVisible()
  })
})
