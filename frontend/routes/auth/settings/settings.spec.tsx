import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import { Settings } from '.'
import { mockClient } from '../../../test-helpers/mock-client'
import { locators } from '../../../../frontend/routes/auth/settings'
import * as packageJson from '../../../../package.json'
import { FULL_ROUTES } from '../../../routes/route-names'
import config from '../../../lib/config'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate
}))

const renderComponent = () =>
  render(
    <JsonRPCProvider>
      <Settings />
    </JsonRPCProvider>
  )

describe('Settings', () => {
  it('renders version, feedback link and lock button', () => {
    // 1101-BWAL-066 I can see the version # of the browser extension
    // 1101-BWAL-067 I can see the feedback link
    mockClient()
    renderComponent()
    expect(screen.getByTestId(locators.settingsPage)).toBeInTheDocument()
    expect(screen.getByTestId(locators.settingsFeedbackDescription)).toHaveTextContent('Spotted any issues or bugs?')
    expect(screen.getByTestId(locators.settingsFeedbackLink)).toHaveTextContent('Provide feedback')
    expect(screen.getByTestId(locators.settingsFeedbackLink)).toHaveAttribute('href', config.feedbackLink)
    expect(screen.getByTestId(locators.settingsLockButton)).toHaveTextContent('Lock')
    expect(screen.getByTestId(locators.settingsVersionNumber)).toHaveTextContent(packageJson.version)
    expect(screen.getByTestId(locators.settingsVersionTitle)).toHaveTextContent('Vega wallet version')
  })
  it('calls admin.lock on lock button click', async () => {
    mockClient()
    renderComponent()
    fireEvent.click(screen.getByTestId(locators.settingsLockButton))
    await waitFor(() => expect(mockedUsedNavigate).toBeCalledWith(FULL_ROUTES.login))
  })
})
