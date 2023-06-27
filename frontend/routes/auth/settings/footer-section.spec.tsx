import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { locators, FooterSection } from './footer-section'
import config from '@config'

jest.mock('../../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: jest.fn()
}))

describe('FooterSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders the FooterSection component', () => {
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ client: { request: jest.fn() } })
    render(<FooterSection />)

    expect(screen.getByTestId(locators.settingsOpenPopoutButton)).toBeInTheDocument()
  })

  test('calls client.request when the popout button is clicked', () => {
    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ client: { request: mockRequest } })
    render(<FooterSection />)

    fireEvent.click(screen.getByTestId(locators.settingsOpenPopoutButton))

    expect(mockRequest).toHaveBeenCalledWith('admin.open_popout', null)
  })

  test('closes the window if config.closeWindowOnPopupOpen is true', async () => {
    config.closeWindowOnPopupOpen = true
    global.close = jest.fn()
    jest.mock('@config', () => ({
      closeWindowOnPopupOpen: true
    }))

    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ client: { request: mockRequest } })
    render(<FooterSection />)

    fireEvent.click(screen.getByTestId(locators.settingsOpenPopoutButton))

    await waitFor(() => expect(global.close).toHaveBeenCalled())
  })

  test('does not close the window if config.closeWindowOnPopupOpen is false', async () => {
    config.closeWindowOnPopupOpen = false
    global.close = jest.fn()

    const mockRequest = jest.fn()
    ;(useJsonRpcClient as unknown as jest.Mock).mockReturnValue({ client: { request: mockRequest } })
    render(<FooterSection />)

    fireEvent.click(screen.getByTestId(locators.settingsOpenPopoutButton))

    await waitFor(() => expect(global.close).not.toHaveBeenCalled())
  })
})
