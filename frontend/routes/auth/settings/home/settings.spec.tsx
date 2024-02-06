import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { JsonRPCProvider } from '@/contexts/json-rpc/json-rpc-provider'
import { useGlobalsStore } from '@/stores/globals'
import { mockClient } from '@/test-helpers/mock-client'
import { mockStore } from '@/test-helpers/mock-store'

import { Settings } from '.'
import { locators } from './settings'

jest.mock('@/stores/globals')
jest.mock('./sections/version-section', () => ({
  VersionSection: () => <div data-testid="version-section" />
}))
jest.mock('./settings-form-elements/radio', () => ({
  SettingsRadio: () => <div data-testid="radio" />
}))
jest.mock('./sections/lock-section', () => ({
  LockSection: () => <div data-testid="lock-section" />
}))
jest.mock('./sections/export-recovery-phrase', () => ({
  ExportRecoveryPhraseSection: () => <div data-testid="export-recovery-phrase-section" />
}))
jest.mock('!/config', () => ({
  ...jest.requireActual('../../../../../config/test').default,
  closeWindowOnPopupOpen: true
}))

const renderComponent = () =>
  render(
    <MemoryRouter>
      <JsonRPCProvider>
        <Settings />
      </JsonRPCProvider>
    </MemoryRouter>
  )

describe('Settings', () => {
  it('renders settings page', () => {
    mockStore(useGlobalsStore, { isMobile: false })
    // 1107-SETT-007 I can see the version # of the browser extension
    // 1107-SETT-008 I can see the feedback link
    mockClient()
    renderComponent()
    expect(screen.getByTestId('version-section')).toBeVisible()
    expect(screen.getByTestId(locators.settingsPage)).toBeVisible()
    expect(screen.getAllByTestId('radio')).toHaveLength(2)
    expect(screen.getByTestId('lock-section')).toBeVisible()
  })

  it('does not render pop out settings on mobile', () => {
    // 1132-ANDR-002 If I am on mobile on settings I do not see the auto popout setting
    // 1133-IOS-002 If I am on mobile on settings I do not see the auto popout setting

    mockStore(useGlobalsStore, { isMobile: true })

    mockClient()
    renderComponent()
    expect(screen.getByTestId('version-section')).toBeVisible()
    expect(screen.getByTestId(locators.settingsPage)).toBeVisible()
    expect(screen.getAllByTestId('radio')).toHaveLength(1)
    expect(screen.getByTestId('lock-section')).toBeVisible()
  })
})
