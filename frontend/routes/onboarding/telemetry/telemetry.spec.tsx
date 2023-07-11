import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Telemetry, locators } from '.'
import { mockClient } from '../../../test-helpers/mock-client'
import { MemoryRouter } from 'react-router-dom'
import { FULL_ROUTES } from '../../route-names'
import config from '@/config'

const saveSettings = jest.fn()

jest.mock('../../../stores/globals', () => ({
  useGlobalsStore: jest.fn((fn) => {
    return fn({
      saveSettings
    })
  })
}))

const mockedRequest = jest.fn()

jest.mock('../../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({ request: mockedRequest })
}))

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate
}))

const renderComponent = () => {
  mockClient()
  return render(
    <MemoryRouter>
      <Telemetry />
    </MemoryRouter>
  )
}

describe('Telemetry', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('renders description, scope of data, user data policy and buttons', () => {
    // 1111-TELE-001 I can see an explanation of what I am being asked to opt in/out to and why
    // 1111-TELE-002 I can click a link to read more details about vega user data policy
    renderComponent()
    expect(screen.getByTestId(locators.description)).toHaveTextContent(
      'Improve Vega Wallet by automatically reporting bugs and crashes.'
    )
    expect(screen.getByTestId(locators.userDataPolicy)).toBeVisible()
    expect(screen.getByTestId(locators.userDataPolicy)).toHaveAttribute('href', config.userDataPolicy)
    expect(screen.getByTestId(locators.reportBugsAndCrashes)).toBeVisible()
    expect(screen.getByTestId(locators.reportBugsAndCrashes)).toHaveFocus()
    expect(screen.getByTestId(locators.noThanks)).toBeVisible()

    expect(screen.getByTestId(locators.scopeContainer)).toBeVisible()
    const scopes = screen.getAllByTestId(locators.scope)
    expect(scopes).toHaveLength(2)
    expect(scopes[0]).toHaveTextContent('Your identity and keys will remain anonymous')
    expect(scopes[1]).toHaveTextContent('You can change this anytime via settings')
  })

  it('saves telemetry settings and navigates to wallets page if opted in', async () => {
    renderComponent()
    fireEvent.click(screen.getByTestId(locators.reportBugsAndCrashes))
    await waitFor(() => expect(screen.getByTestId(locators.reportBugsAndCrashes)).toBeEnabled())
    expect(saveSettings).toHaveBeenCalledWith(mockedRequest, { telemetry: true })
    expect(saveSettings).toBeCalledTimes(1)
    expect(mockedUsedNavigate).toHaveBeenCalledWith(FULL_ROUTES.wallets)
  })

  it('saves telemetry settings and navigates to wallets page if opted out', async () => {
    renderComponent()
    fireEvent.click(screen.getByTestId(locators.noThanks))
    await waitFor(() => expect(screen.getByTestId(locators.noThanks)).toBeEnabled())
    expect(saveSettings).toHaveBeenCalledWith(mockedRequest, { telemetry: false })
    expect(saveSettings).toBeCalledTimes(1)
    expect(mockedUsedNavigate).toHaveBeenCalledWith(FULL_ROUTES.wallets)
  })
})
