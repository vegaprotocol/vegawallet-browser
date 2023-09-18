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
jest.mock('./auto-open-section', () => ({
  AutoOpen: () => <div data-testid="auto-open-section" />
}))
jest.mock('./lock-section', () => ({
  LockSection: () => <div data-testid="lock-section" />
}))

jest.mock('!/config', () => ({
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
    // 1107-SETT-007 I can see the version # of the browser extension
    // 1107-SETT-008 I can see the feedback link
    mockClient()
    renderComponent()
    expect(screen.getByTestId(locators.settingsPage)).toBeVisible()
    expect(screen.getByTestId('version-section')).toBeVisible()
    expect(screen.getByTestId('telemetry-section')).toBeVisible()
    expect(screen.getByTestId('lock-section')).toBeVisible()
    expect(screen.getByTestId('auto-open-section')).toBeVisible()
  })
})
