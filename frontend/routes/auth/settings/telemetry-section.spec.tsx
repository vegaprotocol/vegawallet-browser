import { render, screen, fireEvent } from '@testing-library/react'
import { TelemetrySection, locators } from './telemetry-section'
import config from '@/config'
import { useSaveSettings } from '../../../hooks/save-settings'
import { silenceErrors } from '../../../test-helpers/silence-errors'
import { useGlobalsStore } from '../../../stores/globals'

jest.mock('../../../stores/globals')

jest.mock('../../../hooks/save-settings', () => ({
  useSaveSettings: jest.fn().mockReturnValue({
    save: jest.fn(),
    loading: false
  })
}))

describe('TelemetrySection', () => {
  it('renders the section header correctly', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            telemetry: true
          }
        }
      })
    })
    render(<TelemetrySection />)
    const headerElement = screen.getByText('Vega wallet version')
    expect(headerElement).toBeInTheDocument()
  })

  it('throws error if globals cannot be loaded', () => {
    silenceErrors()
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: null
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
        }
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
        }
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
        }
      })
    })
    render(<TelemetrySection />)
    const telemetryNoOption = screen.getByLabelText('No')
    const { save } = useSaveSettings()
    fireEvent.click(telemetryNoOption)

    expect(save).toHaveBeenCalledTimes(1)
    expect(save).toHaveBeenCalledWith({ telemetry: false })
  })

  it('renders the data policy link correctly', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            telemetry: true
          }
        }
      })
    })
    render(<TelemetrySection />)
    const dataPolicyLink = screen.getByTestId(locators.settingsDataPolicy)
    expect(dataPolicyLink).toBeInTheDocument()
    expect(dataPolicyLink).toHaveAttribute('href', config.userDataPolicy)
    expect(dataPolicyLink).toHaveTextContent("Read Vega Wallet's user data policy")
  })
})
