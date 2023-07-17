import { render, screen, fireEvent } from '@testing-library/react'
import { TelemetrySection, locators } from './telemetry-section'
import config from '@/config'
import { silenceErrors } from '../../../test-helpers/silence-errors'
import { useGlobalsStore } from '../../../stores/globals'

jest.mock('../../../stores/globals')

const mockedRequest = jest.fn()

jest.mock('../../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({ request: mockedRequest })
}))

const saveSettings = jest.fn()

describe('TelemetrySection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('renders the section header correctly', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            telemetry: true
          }
        },
        saveSettings
      })
    })
    render(<TelemetrySection />)
    const headerElement = screen.getByText('Report bugs and crashes')
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
    expect(() => render(<TelemetrySection />)).toThrowError('Tried to render settings page without globals defined')
  })

  it('renders the description text correctly', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            telemetry: true
          }
        },
        saveSettings
      })
    })

    render(<TelemetrySection />)
    const descriptionElement = screen.getByTestId(locators.settingsDescription)
    expect(descriptionElement).toBeInTheDocument()
    expect(descriptionElement).toHaveTextContent('Improve Vega Wallet by automatically reporting bugs and crashes.')
  })

  it('renders the telemetry options correctly', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            telemetry: true
          }
        },
        saveSettings
      })
    })
    render(<TelemetrySection />)
    const telemetryNoOption = screen.getByLabelText('No')
    const telemetryYesOption = screen.getByLabelText('Yes')
    expect(telemetryYesOption).toBeInTheDocument()
    expect(telemetryNoOption).toBeInTheDocument()
  })

  it('calls save function on telemetry option change', async () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            telemetry: true
          }
        },
        saveSettings
      })
    })
    render(<TelemetrySection />)
    const telemetryNoOption = screen.getByLabelText('No')
    fireEvent.click(telemetryNoOption)

    expect(saveSettings).toHaveBeenCalledTimes(1)
    expect(saveSettings).toHaveBeenCalledWith(mockedRequest, { telemetry: false })
  })

  it('shows nothing selected if setting is not set', async () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            telemetry: undefined
          }
        },
        saveSettings
      })
    })
    render(<TelemetrySection />)
    expect(screen.getByLabelText('Yes')).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByLabelText('No')).toHaveAttribute('aria-checked', 'false')
  })

  it('renders the data policy link correctly', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            telemetry: true
          }
        },
        saveSettings
      })
    })
    render(<TelemetrySection />)
    const dataPolicyLink = screen.getByTestId(locators.settingsDataPolicy)
    expect(dataPolicyLink).toBeInTheDocument()
    expect(dataPolicyLink).toHaveAttribute('href', config.userDataPolicy)
    expect(dataPolicyLink).toHaveTextContent("Read Vega Wallet's user data policy")
  })
})
