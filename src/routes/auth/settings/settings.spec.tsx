import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import { Settings } from '.'
import { mockClient } from '../../../test-helpers/mock-client'
import {
  settingsFeedbackDescription,
  settingsFeedbackLink,
  settingsLockButton,
  settingsPage,
  settingsVersionNumber,
  settingsVersionTitle
} from '../../../locator-ids'
import * as packageJson from '../../../../package.json'
import { FULL_ROUTES } from '../../routes'

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
    mockClient()
    renderComponent()
    expect(screen.getByTestId(settingsPage)).toBeInTheDocument()
    expect(screen.getByTestId(settingsFeedbackDescription)).toHaveTextContent('Spotted any issues or bugs?')
    expect(screen.getByTestId(settingsFeedbackLink)).toHaveTextContent('Provide feedback')
    expect(screen.getByTestId(settingsLockButton)).toHaveTextContent('Lock')
    expect(screen.getByTestId(settingsVersionNumber)).toHaveTextContent(packageJson.version)
    expect(screen.getByTestId(settingsVersionTitle)).toHaveTextContent('Vega wallet version')
  })
  it('calls admin.lock on lock button click', async () => {
    mockClient()
    renderComponent()
    fireEvent.click(screen.getByTestId(settingsLockButton))
    await waitFor(() => expect(mockedUsedNavigate).toBeCalledWith(FULL_ROUTES.login))
  })
})
