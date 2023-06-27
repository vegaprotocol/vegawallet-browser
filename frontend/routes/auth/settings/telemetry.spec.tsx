import { render, screen, fireEvent } from '@testing-library/react'
import { TelemetrySection, locators } from './telemetry-section'
import config from '@config'
import { useSaveSettings } from '../../../hooks/save-settings'
jest.mock('../../home/store', () => ({
  useHomeStore: jest.fn().mockReturnValue({
    globals: {
      settings: {
        telemetry: true
      }
    }
  })
}))

jest.mock('../../../hooks/save-settings', () => ({
  useSaveSettings: jest.fn().mockReturnValue({
    save: jest.fn(),
    loading: false
  })
}))

describe('TelemetrySection', () => {
  it('renders the section header correctly', () => {
    render(<TelemetrySection />)
    const headerElement = screen.getByText('Vega wallet version')
    expect(headerElement).toBeInTheDocument()
  })

  it('renders the description text correctly', () => {
    render(<TelemetrySection />)
    const descriptionElement = screen.getByTestId(locators.settingsDescription)
    expect(descriptionElement).toBeInTheDocument()
    expect(descriptionElement).toHaveTextContent('Improve Vega Wallet by automatically reporting bugs and crashes.')
  })

  it('renders the telemetry options correctly', () => {
    render(<TelemetrySection />)
    const telemetryNoOption = screen.getByLabelText('No')
    const telemetryYesOption = screen.getByLabelText('Yes')
    expect(telemetryYesOption).toBeInTheDocument()
    expect(telemetryNoOption).toBeInTheDocument()
  })

  it('calls save function on telemetry option change', async () => {
    render(<TelemetrySection />)
    const telemetryNoOption = screen.getByLabelText('No')
    const { save } = useSaveSettings()
    fireEvent.click(telemetryNoOption)

    expect(save).toHaveBeenCalledTimes(1)
    expect(save).toHaveBeenCalledWith({ telemetry: false })
  })

  it('renders the data policy link correctly', () => {
    render(<TelemetrySection />)
    const dataPolicyLink = screen.getByTestId(locators.settingsDataPolicy)
    expect(dataPolicyLink).toBeInTheDocument()
    expect(dataPolicyLink).toHaveAttribute('href', config.userDataPolicy)
    expect(dataPolicyLink).toHaveTextContent("Read Vega Wallet's user data policy")
  })
})
