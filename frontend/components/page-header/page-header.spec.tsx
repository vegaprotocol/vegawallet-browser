import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { PageHeader, locators } from '.'
import config from '../../lib/config'
import componentLocators from '../locators'

import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'

jest.mock('@config', () => ({
  ...jest.requireActual('../../../config/test').default,
  closeWindowOnPopupOpen: true
}))

jest.mock('../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: jest.fn()
}))

describe('PageHeader', () => {
  it('renders the VegaIcon component', () => {
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ client: { request: jest.fn() } })
    render(<PageHeader />)
    const vegaIconElement = screen.getByTestId(componentLocators.vegaIcon)
    expect(vegaIconElement).toBeVisible()
  })

  it('renders the network indicator correctly', () => {
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ client: { request: jest.fn() } })
    render(<PageHeader />)
    const networkIndicatorElement = screen.getByTestId(locators.networkIndicator)
    expect(networkIndicatorElement).toBeInTheDocument()
    expect(networkIndicatorElement).toHaveTextContent(config.network.name)
  })

  test('closes the window if config.closeWindowOnPopupOpen is true', async () => {
    config.closeWindowOnPopupOpen = true
    global.close = jest.fn()
    jest.mock('@config', () => ({
      closeWindowOnPopupOpen: true
    }))

    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ client: { request: mockRequest } })
    render(<PageHeader />)

    fireEvent.click(screen.getByTestId(locators.openPopoutButton))

    await waitFor(() => expect(global.close).toHaveBeenCalled())
  })

  test('does not close the window if config.closeWindowOnPopupOpen is false', async () => {
    config.closeWindowOnPopupOpen = false
    global.close = jest.fn()

    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ client: { request: mockRequest } })
    render(<PageHeader />)

    fireEvent.click(screen.getByTestId(locators.openPopoutButton))

    await waitFor(() => expect(global.close).not.toHaveBeenCalled())
  })
})
