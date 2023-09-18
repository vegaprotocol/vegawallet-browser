import { render, screen, fireEvent } from '@testing-library/react'
import { locators } from './auto-open-section'
import { silenceErrors } from '../../../test-helpers/silence-errors'
import { useGlobalsStore } from '../../../stores/globals'
import { AutoOpen } from './auto-open-section'

jest.mock('../../../stores/globals')

const mockedRequest = jest.fn()

jest.mock('../../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({ request: mockedRequest })
}))

const saveSettings = jest.fn()

describe('autoOpenSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('renders the section header correctly', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            autoOpen: true
          }
        },
        saveSettings
      })
    })
    render(<AutoOpen />)
    const headerElement = screen.getByText('Auto Open')
    expect(headerElement).toBeInTheDocument()
  })

  it('throws error if globals cannot be loaded', () => {
    silenceErrors()
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: null,
        saveSettings
      })
    })
    expect(() => render(<AutoOpen />)).toThrowError('Tried to render settings page without globals defined')
  })

  it('renders the description text correctly', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            autoOpen: true
          }
        },
        saveSettings
      })
    })

    render(<AutoOpen />)
    const descriptionElement = screen.getByTestId(locators.autoOpenDescription)
    expect(descriptionElement).toBeInTheDocument()
    expect(descriptionElement).toHaveTextContent(
      'Automatically open the wallet when a dApp requests to connect or sends a transaction.'
    )
  })

  it('renders the autoOpen options correctly', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            autoOpen: true
          }
        },
        saveSettings
      })
    })
    render(<AutoOpen />)
    const autoOpenNoOption = screen.getByLabelText('No')
    const autoOpenYesOption = screen.getByLabelText('Yes')
    expect(autoOpenYesOption).toBeInTheDocument()
    expect(autoOpenNoOption).toBeInTheDocument()
  })

  it('calls save function on autoOpen option change', async () => {
    // 1113-POPT-011 There is a way to change the auto open setting
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            autoOpen: true
          }
        },
        saveSettings
      })
    })
    render(<AutoOpen />)
    const autoOpenNoOption = screen.getByLabelText('No')
    fireEvent.click(autoOpenNoOption)

    expect(saveSettings).toHaveBeenCalledTimes(1)
    expect(saveSettings).toHaveBeenCalledWith(mockedRequest, { autoOpen: false })
  })

  it('shows nothing selected if setting is not set', async () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            autoOpen: undefined
          }
        },
        saveSettings
      })
    })
    render(<AutoOpen />)
    expect(screen.getByLabelText('Yes')).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByLabelText('No')).toHaveAttribute('aria-checked', 'false')
  })
})
