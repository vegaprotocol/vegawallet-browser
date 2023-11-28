import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'
import config from '../../lib/config'
import { usePopoverStore } from '../../stores/popover-store'
import { mockStore } from '../../test-helpers/mock-store'
import componentLocators from '../locators'
import { locators,PageHeader } from '.'

const mockPopoverStore = (isPopoverInstance: boolean) => {
  const focusPopover = jest.fn()
  mockStore(usePopoverStore, {
    isPopoverInstance,
    focusPopover
  })
  return focusPopover
}

jest.mock('!/config', () => ({
  ...jest.requireActual('../../../config/test').default,
  closeWindowOnPopupOpen: true
}))

jest.mock('../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: jest.fn()
}))

jest.mock('../../stores/popover-store')

describe('PageHeader', () => {
  it('renders the VegaIcon component', () => {
    mockPopoverStore(false)
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: jest.fn() })
    render(<PageHeader />)
    const vegaIconElement = screen.getByTestId(componentLocators.vegaIcon)
    expect(vegaIconElement).toBeVisible()
  })

  it('renders the network indicator correctly', () => {
    mockPopoverStore(false)
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: jest.fn() })
    render(<PageHeader />)
    const networkIndicatorElement = screen.getByTestId(locators.networkIndicator)
    expect(networkIndicatorElement).toBeInTheDocument()
    expect(networkIndicatorElement).toHaveTextContent(config.network.name)
  })

  it('when opening in new window closes the window if config.closeWindowOnPopupOpen is true', async () => {
    mockPopoverStore(false)
    config.closeWindowOnPopupOpen = true
    global.close = jest.fn()

    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    render(<PageHeader />)

    fireEvent.click(screen.getByTestId(locators.openPopoutButton))

    await waitFor(() => expect(global.close).toHaveBeenCalled())
  })

  it('when opening in new window does not close the window if config.closeWindowOnPopupOpen is false', async () => {
    mockPopoverStore(false)
    config.closeWindowOnPopupOpen = false
    global.close = jest.fn()

    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    render(<PageHeader />)

    fireEvent.click(screen.getByTestId(locators.openPopoutButton))

    await waitFor(() => expect(global.close).not.toHaveBeenCalled())
  })

  it('renders close button if popover is open', async () => {
    const mockClose = mockPopoverStore(true)
    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    render(<PageHeader />)

    fireEvent.click(screen.getByTestId(locators.openPopoutButton))

    await waitFor(() => expect(mockClose).toHaveBeenCalled())
  })
  it('does not render open in new window if feature is turned off', async () => {
    mockPopoverStore(true)
    config.features = {
      popoutHeader: false
    }
    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    render(<PageHeader />)
    expect(screen.queryByTestId(locators.openPopoutButton)).not.toBeInTheDocument()
  })
  it('does not render open in new window if feature is not defined', async () => {
    mockPopoverStore(true)
    config.features = undefined
    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
    render(<PageHeader />)
    expect(screen.queryByTestId(locators.openPopoutButton)).not.toBeInTheDocument()
  })
})
