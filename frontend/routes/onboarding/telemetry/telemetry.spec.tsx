import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Telemetry, locators } from '.'
import { mockClient } from '../../../test-helpers/mock-client'
import { MemoryRouter } from 'react-router-dom'
import { FULL_ROUTES } from '../../route-names'
import { RpcMethods } from '../../../lib/client-rpc-methods'

const mockLoadGlobals = jest.fn()

jest.mock('../../home/store', () => ({
  useHomeStore: jest.fn((store) => ({ loadGlobals: mockLoadGlobals }))
}))

const mockedClient = {
  request: jest.fn()
}

jest.mock('../../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({ client: mockedClient })
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
    renderComponent()
    expect(screen.getByTestId(locators.description)).toHaveTextContent(
      'Improve Vega Wallet by automatically reporting bugs and crashes.'
    )
    expect(screen.getByTestId(locators.userDataPolicy)).toBeVisible()
    expect(screen.getByTestId(locators.reportBugsAndCrashes)).toBeVisible()
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
    expect(mockedUsedNavigate).toHaveBeenCalledWith(FULL_ROUTES.wallets)
    expect(mockedClient.request).toHaveBeenCalledWith(RpcMethods.UpdateSettings, { telemetry: true })
    expect(mockedClient.request).toBeCalledTimes(1)
    expect(mockLoadGlobals).toHaveBeenCalled()
  })

  it('saves telemetry settings and navigates to wallets page if opted out', async () => {
    renderComponent()
    fireEvent.click(screen.getByTestId(locators.noThanks))
    await waitFor(() => expect(screen.getByTestId(locators.noThanks)).toBeEnabled())
    expect(mockedUsedNavigate).toHaveBeenCalledWith(FULL_ROUTES.wallets)
    expect(mockedClient.request).toHaveBeenCalledWith(RpcMethods.UpdateSettings, { telemetry: false })
    expect(mockedClient.request).toBeCalledTimes(1)
    expect(mockLoadGlobals).toHaveBeenCalled()
  })
})
