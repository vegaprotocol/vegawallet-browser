import { render, screen, fireEvent } from '@testing-library/react'
import { TelemetrySection, locators } from './telemetry-section'
import config from '@config'
import { useSaveSettings } from '../../../hooks/save-settings'
import { useHomeStore } from '../../home/store'

jest.mock('../../home/store', () => ({
  useHomeStore: jest.fn()
}))

jest.mock('../../../hooks/save-settings', () => ({
  useSaveSettings: jest.fn().mockReturnValue({
    save: jest.fn(),
    loading: false
  })
}))

describe('TelemetrySection', () => {
  it('renders the section header correctly', () => {
    ;(useHomeStore as unknown as jest.Mock).mockReturnValue({
      globals: {
        settings: {
          telemetry: true
        }
      }
    })
    render(<TelemetrySection />)
    const headerElement = screen.getByText('Vega wallet version')
    expect(headerElement).toBeInTheDocument()
  })

  it('throws error if globals cannot be loaded', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(useHomeStore as unknown as jest.Mock).mockReturnValue({
      globals: null
    })
    expect(() => render(<TelemetrySection />)).toThrowError('Tried to render settings page without globals defined')
  })

  it('renders the description text correctly', () => {
    ;(useHomeStore as unknown as jest.Mock).mockReturnValue({
      globals: {
        settings: {
          telemetry: true
        }
      }
    })
    render(<TelemetrySection />)
    const descriptionElement = screen.getByTestId(locators.settingsDescription)
    expect(descriptionElement).toBeInTheDocument()
    expect(descriptionElement).toHaveTextContent('Improve Vega Wallet by automatically reporting bugs and crashes.')
  })

  it('renders the telemetry options correctly', () => {
    ;(useHomeStore as unknown as jest.Mock).mockReturnValue({
      globals: {
        settings: {
          telemetry: true
        }
      }
    })
    render(<TelemetrySection />)
    const telemetryNoOption = screen.getByLabelText('No')
    const telemetryYesOption = screen.getByLabelText('Yes')
    expect(telemetryYesOption).toBeInTheDocument()
    expect(telemetryNoOption).toBeInTheDocument()
  })

  it('calls save function on telemetry option change', async () => {
    ;(useHomeStore as unknown as jest.Mock).mockReturnValue({
      globals: {
        settings: {
          telemetry: true
        }
      }
    })
    render(<TelemetrySection />)
    const telemetryNoOption = screen.getByLabelText('No')
    const { save } = useSaveSettings()
    fireEvent.click(telemetryNoOption)

    expect(save).toHaveBeenCalledTimes(1)
    expect(save).toHaveBeenCalledWith({ telemetry: false })
  })

  it('renders the data policy link correctly', () => {
    ;(useHomeStore as unknown as jest.Mock).mockReturnValue({
      globals: {
        settings: {
          telemetry: true
        }
      }
    })
    render(<TelemetrySection />)
    const dataPolicyLink = screen.getByTestId(locators.settingsDataPolicy)
    expect(dataPolicyLink).toBeInTheDocument()
    expect(dataPolicyLink).toHaveAttribute('href', config.userDataPolicy)
    expect(dataPolicyLink).toHaveTextContent("Read Vega Wallet's user data policy")
  })
})
