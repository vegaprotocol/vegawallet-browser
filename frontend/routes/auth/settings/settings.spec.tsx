import { render, screen } from '@testing-library/react'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import { Settings } from '.'
import { mockClient } from '../../../test-helpers/mock-client'
import { locators } from '../../../../frontend/routes/auth/settings'

jest.mock('./version-section', () => ({
  VersionSection: () => <div data-testid="version-section" />
}))
jest.mock('./settings-form-elements/radio', () => ({
  SettingsRadio: () => <div data-testid="radio" />
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
    expect(screen.getByTestId('version-section')).toBeVisible()
    expect(screen.getByTestId(locators.settingsPage)).toBeVisible()
    expect(screen.getAllByTestId('radio')).toHaveLength(2)
    expect(screen.getByTestId('lock-section')).toBeVisible()
  })
})
