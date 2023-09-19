import { render, screen, fireEvent } from '@testing-library/react'
import { silenceErrors } from '../../../../test-helpers/silence-errors'
import { useGlobalsStore } from '../../../../stores/globals'
import { SettingsRadio, locators } from './radio'

jest.mock('../../../../stores/globals')

const mockedRequest = jest.fn()

jest.mock('../../../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({ request: mockedRequest })
}))

const saveSettings = jest.fn()
const testSettingName = 'setting'

const renderComponent = () =>
  render(<SettingsRadio sectionHeader="Header" setting={testSettingName} description="description" />)

describe('SettingsRadio', () => {
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
    renderComponent()
    const headerElement = screen.getByText('Header')
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
    expect(() => renderComponent()).toThrowError('Tried to render settings page without globals defined')
  })

  it('renders the description text correctly', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            setting: true
          }
        },
        saveSettings
      })
    })

    renderComponent()
    const descriptionElement = screen.getByTestId(`${testSettingName}-${locators.settingsRadioDescription}`)
    expect(descriptionElement).toBeInTheDocument()
    expect(descriptionElement).toHaveTextContent('description')
  })

  it('renders the autoOpen options correctly', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            setting: true
          }
        },
        saveSettings
      })
    })
    renderComponent()
    const noOption = screen.getByLabelText('No')
    const yesOption = screen.getByLabelText('Yes')
    expect(yesOption).toBeInTheDocument()
    expect(noOption).toBeInTheDocument()
  })

  it('calls save function on option change', async () => {
    // 1113-POPT-011 There is a way to change the auto open setting
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            setting: true
          }
        },
        saveSettings
      })
    })
    renderComponent()

    const noOption = screen.getByLabelText('No')
    fireEvent.click(noOption)

    expect(saveSettings).toHaveBeenCalledTimes(1)
    expect(saveSettings).toHaveBeenCalledWith(mockedRequest, { setting: false })
  })

  it('shows nothing selected if setting is not set', async () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            setting: undefined
          }
        },
        saveSettings
      })
    })
    renderComponent()

    expect(screen.getByLabelText('Yes')).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByLabelText('No')).toHaveAttribute('aria-checked', 'false')
  })

  it('renders children correctly', () => {
    ;(useGlobalsStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        globals: {
          settings: {
            setting: true
          }
        },
        saveSettings
      })
    })
    render(
      <SettingsRadio sectionHeader="Header" setting="setting" description="description">
        <div data-testid="child" />
      </SettingsRadio>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
