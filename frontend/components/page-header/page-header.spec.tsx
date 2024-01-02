import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'
import config from '@/lib/config'
import { useGlobalsStore } from '@/stores/globals'
import { usePopoverStore } from '@/stores/popover-store'
import { mockStore } from '@/test-helpers/mock-store'

import { fairground } from '../../../config/well-known-networks'
import componentLocators from '../locators'
import { locators, PageHeader } from '.'

jest.mock('!/config', () => ({
  ...jest.requireActual('../../../config/test').default,
  closeWindowOnPopupOpen: true
}))

jest.mock('@/contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: jest.fn()
}))

jest.mock('@/stores/popover-store')
jest.mock('@/stores/globals')

const mockPopoverStore = (isPopoverInstance: boolean) => {
  const focusPopover = jest.fn()
  mockStore(usePopoverStore, {
    isPopoverInstance,
    focusPopover
  })
  return focusPopover
}

const mockGlobalsStore = (isMobile = false) => {
  mockStore(useGlobalsStore, {
    isMobile
  })
}

const renderComponent = () =>
  render(
    <MockNetworkProvider>
      <PageHeader />
    </MockNetworkProvider>
  )

describe('PageHeader', () => {
  it('renders the VegaIcon component', () => {
    mockPopoverStore(false)
    mockGlobalsStore()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: jest.fn() })
    renderComponent()
    const vegaIconElement = screen.getByTestId(componentLocators.vegaIcon)
    expect(vegaIconElement).toBeVisible()
  })

  it('renders the network indicator correctly', () => {
    mockPopoverStore(false)
    mockGlobalsStore()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: jest.fn() })
    renderComponent()

    const networkIndicatorElement = screen.getByTestId(locators.networkIndicator)
    expect(networkIndicatorElement).toBeInTheDocument()
    expect(networkIndicatorElement).toHaveTextContent(fairground.name)
  })

  it('when opening in new window closes the window if config.closeWindowOnPopupOpen is true', async () => {
    mockPopoverStore(false)
    mockGlobalsStore()
    config.closeWindowOnPopupOpen = true
    global.close = jest.fn()

    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    renderComponent()

    fireEvent.click(screen.getByTestId(locators.openPopoutButton))

    await waitFor(() => expect(global.close).toHaveBeenCalled())
  })

  it('when opening in new window does not close the window if config.closeWindowOnPopupOpen is false', async () => {
    mockPopoverStore(false)
    mockGlobalsStore()
    config.closeWindowOnPopupOpen = false
    global.close = jest.fn()

    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    renderComponent()

    fireEvent.click(screen.getByTestId(locators.openPopoutButton))

    await waitFor(() => expect(global.close).not.toHaveBeenCalled())
  })

  it('renders close button if popover is open', async () => {
    mockGlobalsStore()
    const mockClose = mockPopoverStore(true)
    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    renderComponent()

    fireEvent.click(screen.getByTestId(locators.openPopoutButton))

    await waitFor(() => expect(mockClose).toHaveBeenCalled())
  })
  it('does not render open in new window if feature is turned off', async () => {
    mockPopoverStore(true)
    mockGlobalsStore()
    config.features = {
      popoutHeader: false
    }
    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    renderComponent()

    expect(screen.queryByTestId(locators.openPopoutButton)).not.toBeInTheDocument()
  })
  it('does not render open in new window if feature is not defined', async () => {
    mockPopoverStore(true)
    mockGlobalsStore()
    config.features = undefined
    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    renderComponent()

    expect(screen.queryByTestId(locators.openPopoutButton)).not.toBeInTheDocument()
  })

  it('does not render popout button when in mobile', async () => {
    mockPopoverStore(true)
    mockGlobalsStore(true)
    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    renderComponent()

    expect(screen.queryByTestId(locators.openPopoutButton)).not.toBeInTheDocument()
  })
})
