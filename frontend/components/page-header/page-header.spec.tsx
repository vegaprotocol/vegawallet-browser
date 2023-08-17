// import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { render, screen } from '@testing-library/react'
import { PageHeader, locators } from '.'
import config from '../../lib/config'
import componentLocators from '../locators'

import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'

import { usePopoverStore } from '../../stores/popover-store'

const mockPopoverStore = (isPopoverInstance: boolean) => {
  const focusPopover = jest.fn()
  ;(usePopoverStore as unknown as jest.Mock).mockImplementation((fn) => {
    return fn({
      isPopoverInstance,
      focusPopover
    })
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

  // test('when opening in new window closes the window if config.closeWindowOnPopupOpen is true', async () => {
  //   mockPopoverStore(false)
  //   config.closeWindowOnPopupOpen = true
  //   global.close = jest.fn()

  //   const mockRequest = jest.fn()
  //   ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
  //   render(<PageHeader />)

  //   fireEvent.click(screen.getByTestId(locators.openPopoutButton))

  //   await waitFor(() => expect(global.close).toHaveBeenCalled())
  // })

  // test('when opening in new window does not close the window if config.closeWindowOnPopupOpen is false', async () => {
  //   mockPopoverStore(false)
  //   config.closeWindowOnPopupOpen = false
  //   global.close = jest.fn()

  //   const mockRequest = jest.fn()
  //   ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
  //   render(<PageHeader />)

  //   fireEvent.click(screen.getByTestId(locators.openPopoutButton))

  //   await waitFor(() => expect(global.close).not.toHaveBeenCalled())
  // })

  // test('renders close button if popover is open', async () => {
  //   const mockClose = mockPopoverStore(true)
  //   const mockRequest = jest.fn()
  //   ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ request: mockRequest })
  //   render(<PageHeader />)

  //   fireEvent.click(screen.getByTestId(locators.openPopoutButton))

  //   await waitFor(() => expect(mockClose).toHaveBeenCalled())
  // })
})
